import { useEffect, useState } from "@wordpress/element";
import {
	FormTokenField,
	Button,
	TextControl,
	Icon,
	__experimentalToggleGroupControl,
	__experimentalToggleGroupControlOption,
} from "@wordpress/components";

import {
	LinkControl,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import {
	link,
	seen,
	tag,
	edit,
	swatch,
	page,
	chevronDown,
	chevronRight,
} from "@wordpress/icons";
import ArrowUpIcon from "../assets/icons/arrow-up-right-from-square-sharp-regular.svg";
import ArrowDownIcon from "../assets/icons/arrow-down-right-sharp-regular.svg";
import PdfIcon from "../assets/icons/file-pdf-sharp-regular.svg";
import ZipIcon from "../assets/icons/file-zip-sharp-regular.svg";
import VideoIcon from "../assets/icons/video-sharp-regular.svg";

const REST_NONCE = window.udLinkBlockSettings?.nonce || "";

// Haken für Block-Hierarchie
function useIsInFilterContainer(clientId) {
	return useSelect(
		(select) => {
			const { getBlockRootClientId, getBlockName } =
				select(blockEditorStore);
			let parentId = getBlockRootClientId(clientId);
			while (parentId) {
				if (
					getBlockName(parentId) ===
					"ud/ud-link-filter-container-block"
				) {
					return true;
				}
				parentId = getBlockRootClientId(parentId);
			}
			return false;
		},
		[clientId]
	);
}

export default function Edit({ attributes, setAttributes, clientId }) {
	const { item = {}, mode = "link" } = attributes;
	const [globalTags, setGlobalTags] = useState([]);
	const blockProps = useBlockProps();
	const isInFilterContainer = useIsInFilterContainer(clientId);
	const [isEditingTarget, setIsEditingTarget] = useState(false);
	const [showOptions, setShowOptions] = useState(false); // <–– Optionen-Visibility

	useEffect(() => {
		fetch("/wp-json/ud-shared/v1/tags", {
			headers: {
				"Content-Type": "application/json",
				//"X-WP-Nonce": REST_NONCE,
			},
		})
			.then((res) => res.json())
			.then((tags) => {
				if (Array.isArray(tags)) {
					setGlobalTags(tags);
				}
			})
			.catch((error) => {
				console.warn("Fehler beim Laden der Tags:", error);
				setGlobalTags([]);
			});
	}, []);

	useEffect(() => {
		// Nur initial setzen, wenn beim Reload kein Modus vorhanden ist
		if (!attributes.mode) {
			if (item.mediaId) {
				setAttributes({ mode: "media" });
			} else if (item.url) {
				setAttributes({ mode: "link" });
			}
		}
	}, []);
	useEffect(() => {
		if (
			item.mediaId && // ein Medium ist gespeichert ✅
			attributes.mode !== "media" // ...aber Modus ist falsch ❌
		) {
			setAttributes({ mode: "media" });
		}
	}, []);

	useEffect(() => {
		const tags = attributes?.item?.tags || [];
		if (!Array.isArray(tags)) return;

		const newTags = tags.filter((tag) => !globalTags.includes(tag));

		if (newTags.length === 0) return;

		newTags.forEach((tag) => {
			fetch("/wp-json/ud-shared/v1/tags", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-WP-Nonce": REST_NONCE,
				},
				body: JSON.stringify({ name: tag }),
			})
				.then((res) => res.json())
				.then((updatedTags) => {
					if (Array.isArray(updatedTags)) {
						setGlobalTags(updatedTags);
					}
				})
				.catch((err) =>
					console.warn(
						"❌ Fehler beim automatischen Speichern des Tags:",
						err
					)
				);
		});
	}, [attributes]);

	const updateItem = (newData) => {
		setAttributes({ item: { ...item, ...newData } });
	};
	const setMode = (newMode) => setAttributes({ mode: newMode });

	const addTag = (newTag) => {
		if (
			typeof newTag !== "string" ||
			!(newTag = newTag.trim()) ||
			item.tags?.includes(newTag)
		) {
			return;
		}

		setAttributes({
			item: {
				...item,
				tags: [...(item.tags || []), newTag],
			},
		});

		fetch("/wp-json/ud-shared/v1/tags", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				//"X-WP-Nonce": REST_NONCE,
			},
			body: JSON.stringify({ name: newTag }),
		})
			.then((res) => res.json())
			.then((tags) => {
				if (Array.isArray(tags)) {
					setGlobalTags(tags);
				}
			})
			.catch((err) => {
				console.warn("❌ Fehler beim Speichern des Tags:", err);
			});
	};

	return (
		<div {...blockProps}>
			<div className="ud-link-block">
				<div className="ud-link-block__fields">
					{/* Zeile 1: Hauptreihe */}
					<div className="ud-link-block__row ud-link-block__row--primary">
						{/* Feld: Anzeigetext */}
						<div className="ud-link-block__field ud-link-block__field--anzeigetext">
							<div className="ud-link-block__label">
								<Icon
									icon={seen}
									className="ud-link-block__icon"
								/>

								<span>Anzeigetext</span>
							</div>
							<TextControl
								placeholder="Anzeigetext"
								value={item.title || ""}
								onChange={(newTitle) =>
									updateItem({ title: newTitle })
								}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						</div>

						{/* Feld: Ziel */}
						<div className="ud-link-block__field ud-link-block__field--target">
							<div className="ud-link-block__label">
								<Icon
									icon={link}
									className="ud-link-block__icon"
								/>
								<span>Ziel</span>
							</div>
							<div className="ud-link-block__target-preview">
								<div className="ud-link-block__target-filename-wrapper">
									<span
										className="ud-link-block__target-filename"
										title={item.url}
									>
										{item.url
											? item.url
													?.split("/")
													.filter(Boolean)
													.pop()
											: "Kein Ziel gewählt"}
									</span>
								</div>
								<Button
									size="small"
									icon={edit}
									variant="tertiary"
									label="Ziel bearbeiten"
									onClick={() =>
										setIsEditingTarget((v) => !v)
									}
								/>
							</div>

							{isEditingTarget && (
								<div
									className={`ud-link-block__target-edit-area mode-${mode}`}
								>
									{/* Link/Media-Toggle */}
									<__experimentalToggleGroupControl
										label="Zieltyp"
										value={mode}
										onChange={(newValue) =>
											setMode(newValue)
										}
										isBlock
										className="ud-link-block__target-toggle"
										__next40pxDefaultSize={true}
										__nextHasNoMarginBottom={true}
									>
										<__experimentalToggleGroupControlOption
											value="link"
											label="Link"
										/>
										<__experimentalToggleGroupControlOption
											value="media"
											label="Medium"
										/>
									</__experimentalToggleGroupControl>

									{/* LinkControl oder MediaUpload */}
									<div
										className={`ud-link-block__target-control mode-${mode}`}
									>
										{mode === "media" && (
											<div
												className={`ud-link-block__selected-target${
													item.mediaId
														? ""
														: " is-placeholder"
												}`}
											>
												<span>
													{item.mediaId && item.url
														? item.url
																.split("/")
																.pop()
														: "Kein Medium ausgewählt"}
												</span>
											</div>
										)}

										{mode === "media" ? (
											<MediaUploadCheck>
												<MediaUpload
													onSelect={(media) => {
														//const url = media.url;

														const url = media.url; // Datei-URL
														//const attachmentLink =
														//media.link; // Attachment-Permalink
														const attachmentLink =
															media.mime ===
																"application/pdf" ||
															media.mime ===
																"application/zip" ||
															media.mime ===
																"application/x-zip-compressed"
																? media.url
																: media.link;

														const isPdf =
															!!url.match(
																/\.pdf$/i
															);
														const isZip =
															!!url.match(
																/\.zip$/i
															);
														const isMp4 =
															!!url.match(
																/\.mp4$/i
															);

														updateItem({
															url,
															mediaId: media.id,
															isPdf,
															isZip,
															isMp4,
															attachmentLink,

															isExternal: false, // Medien sind intern
															opensInNewTab: true, // Immer in neuem Tab öffnen für Anhänge
														});
														setAttributes({
															mode: "media",
														}); // ✅ DAS ist entscheidend

														/*console.log(
															"[edit.js] MediaUpload onSelect - Flags:",
															{
																url,
																attachmentLink,
																isPdf,
																isZip,
																isMp4,
															},
														);*/
													}}
													allowedTypes={[
														"application/pdf",
														"application/zip",
														"image",
														"video/mp4",
													]}
													value={item.mediaId}
													render={({ open }) => (
														<Button
															variant="tertiary"
															icon={edit}
															label={
																item.mediaId
																	? "Medium bearbeiten"
																	: "Medium auswählen"
															}
															aria-label="Medium bearbeiten"
															className="is-compact"
															onClick={open}
														/>
													)}
												/>
											</MediaUploadCheck>
										) : (
											<LinkControl
												value={{
													url: item.mediaId
														? ""
														: item.url || "",
													title: item.title || "",
													opensInNewTab:
														item.opensInNewTab ||
														false,
												}}
												onChange={(newData) => {
													const url =
														newData.url || "";
													const isPdf =
														!!url.match(/\.pdf$/i);
													const isZip =
														!!url.match(/\.zip$/i);

													const isYouTube =
														/youtube\.com|youtu\.be/.test(
															url
														);
													const isVimeo =
														/vimeo\.com/.test(url);
													const isMp4 =
														!!url.match(/\.mp4$/i);
													const isVideoPlatform =
														isYouTube || isVimeo;
													const isExternal =
														url.startsWith(
															"http"
														) &&
														!url.includes(
															window.location
																.hostname
														);

													const opensInNewTab =
														isPdf ||
														isZip ||
														isExternal ||
														isMp4 ||
														isVideoPlatform;

													updateItem({
														url,
														title:
															item.title ||
															newData.title ||
															"",
														mediaId: undefined,
														isPdf,
														isZip,
														isMp4,
														isVideoPlatform,
														isExternal,
														opensInNewTab,
													});
												}}
											/>
										)}
									</div>
									<Button
										className="ud-link-block__target-edit-finish-btn"
										variant="tertiary"
										size="small"
										onClick={() =>
											setIsEditingTarget(false)
										}
									>
										Schliessen
									</Button>
								</div>
							)}
						</div>

						{/* Feld: Aktionen (jetzt Teil der Row) */}
						<div className="ud-link-block__field ud-link-block__field--actions">
							<div className="ud-link-block__label">
								&nbsp;
								{/* optional Label oder leer */}
							</div>
							<div className="ud-link-block__actions-inner">
								{item.isPdf && (
									<PdfIcon className="ud-link-block__icon ud-link-block__link-icon" />
								)}

								{item.isZip && (
									<ZipIcon className="ud-link-block__icon ud-link-block__link-icon" />
								)}

								{(item.isMp4 || item.isVideoPlatform) && (
									<VideoIcon className="ud-link-block__icon ud-link-block__link-icon" />
								)}

								{item.isExternal &&
									!item.isVideoPlatform &&
									!item.isMp4 && (
										<ArrowUpIcon className="ud-link-block__icon ud-link-block__link-icon" />
									)}

								{item.url &&
									!item.isPdf &&
									!item.isMp4 &&
									!item.isZip &&
									!item.isExternal && (
										<ArrowDownIcon className="ud-link-block__icon ud-link-block__link-icon" />
									)}

								{!item.url && (
									<Icon
										icon={swatch}
										className="ud-link-block__icon ud-link-block__link-icon swatch"
									/>
								)}
							</div>
						</div>
					</div>

					{/* Zeile 2 – z. B. "Optionen einblenden" (optional) */}

					{isInFilterContainer && (
						<div className="ud-link-block__row ud-link-block__row--options-toggle">
							<Button
								variant="tertiary"
								size="small"
								icon={showOptions ? chevronDown : chevronRight}
								onClick={() => setShowOptions((v) => !v)}
							>
								{showOptions ? "Optionen" : "Optionen"}
							</Button>
						</div>
					)}

					{/* Zeile 3 – Beschreibung & Tags */}
					{isInFilterContainer && showOptions && (
						<div className="ud-link-block__row ud-link-block__row--meta">
							{/* Beschreibung */}
							<div className="ud-link-block__field ud-link-block__field--description">
								<div className="ud-link-block__label">
									<Icon
										icon={page}
										className="ud-link-block__icon"
									/>
									<span>Beschreibung</span>
								</div>
								<TextControl
									value={item.description || ""}
									placeholder="Kurzbeschreibung"
									onChange={(desc) =>
										updateItem({ description: desc })
									}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
							</div>

							{/* Tags */}
							<div className="ud-link-block__field ud-link-block__field--tags">
								<div className="ud-link-block__label">
									<Icon
										icon={tag}
										className="ud-link-block__icon"
									/>
									<span>Tags</span>
								</div>
								<FormTokenField
									value={item.tags || []}
									suggestions={globalTags}
									onChange={(tags) => {
										updateItem({ tags });

										tags.forEach((tag) => {
											if (!globalTags.includes(tag)) {
												addTag(tag); // ✅ hier wird deine Funktion manuell aufgerufen
											}
										});
									}}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
