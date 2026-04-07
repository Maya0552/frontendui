export const GroupStudyURI = '/PortalOsoba/StudiumSkupina/Uic/';

/**
 * A React component that renders a link to a groupstudy.
 * The link opens in a new window.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.groupstudy - The groupstudy object.
 * @param {string} props.groupstudy.uco - The identifier of the groupstudy.
 * @param {string} [props.groupstudy.name] - The name of the groupstudy.
 *
 * @returns {JSX.Element} A link element that opens in a new window.
 */
export const GroupStudyLink = ({ groupstudy }) => {
    return (
      <a
        href={`${GroupStudyURI}${groupstudy?.uic}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {groupstudy?.name || "PLINK"}
      </a>
    );
  };
  