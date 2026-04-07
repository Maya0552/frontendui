/**
 * A React component that renders a link to a publication.
 * The link opens in a new window.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.publication - The publication object.
 * @param {string} props.publication.id - The identifier of the publication.
 * @param {string} [props.publication.name] - The name of the publication.
 *
 * @returns {JSX.Element} A link element that opens in a new window.
 */
export const PublicationLink = ({ publication }) => {
    return (
      <a
        href={`/vvi/Vysledek/${publication?.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {publication?.name || "PLINK"}
      </a>
    );
  };
  