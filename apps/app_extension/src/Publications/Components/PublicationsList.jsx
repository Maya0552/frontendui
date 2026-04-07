export const PublicationList = ({ publications }) => {
    return (
      <div>
        <h2>Seznam publikací</h2>
        {publications.length === 0 ? (
          <p>Žádné publikace k zobrazení.</p>
        ) : (
          publications.map((pub, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                marginBottom: '10px'
              }}
            >
              <h3>{pub.title}</h3>
              <p>
                <strong>Rok uplatnění:</strong> {pub.year} | <strong>ID:</strong> {pub.id} |{' '}
                <strong>Podíl:</strong> {pub.share} %
              </p>
              <p>
                <strong>Původní jazyk:</strong> {pub.originalLanguage} | <strong>Druh:</strong> {pub.type}
              </p>
              {pub.authors && pub.authors.length > 0 && (
                <div>
                  <strong>Autoři:</strong>
                  <ul>
                    {pub.authors.map((author, aIndex) => (
                      <li key={aIndex}>
                        {author.name} {author.id && `(ID: ${author.id})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  };