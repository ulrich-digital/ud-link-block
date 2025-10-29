import { useBlockProps } from "@wordpress/block-editor";
//import filePdfIcon from "../assets/icons/file-pdf-sharp-solid.svg";
import ArrowUpIcon from "../assets/icons/arrow-up-right-from-square-sharp-solid.svg";
import ArrowDownIcon from "../assets/icons/arrow-down-right-sharp-solid.svg";
import PdfIcon from "../assets/icons/file-pdf-sharp-solid.svg";
import ZipIcon from "../assets/icons/file-zip-sharp-solid.svg";
import VideoIcon from "../assets/icons/video-sharp-solid.svg";

const slugify = (str) =>
	str
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "") // Akzente entfernen
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");

const Save = ({ attributes = {} }) => {
	const { item = {} } = attributes;






	const blockProps = useBlockProps.save();

	if (!item?.url || !item?.title) return null;

	const tagArray = Array.isArray(item.tags) ? item.tags : [];
	const tagData = JSON.stringify(tagArray);
	const tagSlugs = JSON.stringify(tagArray.map(slugify));

	const classList = ["ud-link-block__link"];
	if (item.isPdf) classList.push("link--pdf");
	else if (item.isExternal) classList.push("link--external");
	else if (item.isMp4 || item.isVideoPlatform) classList.push("link--video"); 
	else classList.push("link--internal");

	const customBlockProps = {
		...blockProps,
		"data-tags": tagData,
		"data-tags-slug": tagSlugs,
	};

	const target = item.opensInNewTab ? "_blank" : "_self";

	return (
		<div {...customBlockProps}>
			<a
				  href={item.attachmentLink || item.url || '#'}
//href={item.url}
				target={target}
				rel="noopener noreferrer"
				className="ud-link-block"
			>
				<div className="ud-link-block__content">
					<div className="ud-link-block__text-group">
						<div className="ud-link-block__title">{item.title}</div>
						{item.description && (
							<div className="ud-link-block__description">
								{item.description}
							</div>
						)}
					</div>

					{tagArray.length > 0 && (
						<div className="ud-link-block__tags">
							<div className="ud-link-block__tag-chips">
								{tagArray.map((tag, i) => (
									<span key={i} className="tag-chip">
										{tag}
									</span>
								))}
							</div>
						</div>
					)}
				</div>

<div className="ud-link-block__icon">
  {item.isPdf ? (
    <PdfIcon className="ud-link-block__link-icon" />
  ) : item.isZip ? (
    <ZipIcon className="ud-link-block__link-icon" />
  ) : item.isMp4 || item.isVideoPlatform ? (  // <-- HIER zuerst VideoIcon
    <VideoIcon className="ud-link-block__link-icon" />
  ) : item.isExternal ? (
    <ArrowUpIcon className="ud-link-block__link-icon" />
  ) : item.url ? (
    <ArrowDownIcon className="ud-link-block__link-icon" />
  ) : null}
</div>


			</a>
		</div>
	);
};

export default Save;
