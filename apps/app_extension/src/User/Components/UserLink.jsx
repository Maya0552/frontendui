export const UserURI = '/PortalOsoba/Vyucujici/';

/**
 * A React component that renders a link to a user.
 * The link opens in a new window.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.user - The user object.
 * @param {string} props.user.uco - The identifier of the user.
 * @param {string} [props.user.name] - The name of the user.
 *
 * @returns {JSX.Element} A link element that opens in a new window.
 */
export const UserLink = ({ user }) => {
    return (
      <a
        href={`${UserURI}${user?.uco}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {user?.name || "PLINK"}
      </a>
    );
  };
  