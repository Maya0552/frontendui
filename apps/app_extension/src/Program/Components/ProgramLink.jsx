export const ProgramURI = '/PortalOsoba/Program/';

/**
 * A React component that renders a link to a program.
 * The link opens in a new window.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.program - The program object.
 * @param {string} props.program.uco - The identifier of the program.
 * @param {string} [props.program.name] - The name of the program.
 *
 * @returns {JSX.Element} A link element that opens in a new window.
 */
export const ProgramLink = ({ program }) => {
    return (
      <a
        href={`${ProgramURI}${program?.uic}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {program?.name || "PLINK"}
      </a>
    );
  };
  