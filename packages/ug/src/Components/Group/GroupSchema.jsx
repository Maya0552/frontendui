import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";
import { createLazyComponent } from "@hrbolek/uoisfrontend-shared";

const GROUP_QUERY = `
  query group($id: UUID!) {
    groupById(id: $id) {
      ...Group
      mastergroup {
        ...Group
        mastergroup {
          ...Group
        }
      }
      subgroups {
        ...Group
        subgroups {
          ...Group
        }
      }
    }
  }

  fragment Group on GroupGQLModel {
    __typename
    id
    name
  }
`;

// Styles as a JavaScript object (CSS-in-JS)
const styles = {
    organizationChart: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    groupContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '16px',
    },
    group: {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
    },
    groupChildren: {
        display: 'flex',
        flexWrap: 'wrap', // Allows wrapping for wide rows
        gap: '16px',
        justifyContent: 'center',
        width: '100%', // Makes children fill the parent container width
            
      },
    gg: {
        padding: '16px',
        border: '2px solid #007bff', // Top frame

        // paddingTop: '16px',
        // borderTop: '2px solid #007bff', // Top frame
        // borderBottom: '2px solid #007bff', // Bottom frame
        // paddingBottom: '16px', // Add spacing inside the bottom frame    
    }
};

// RenderGroup Component
export  const RenderGroup = ({ group }) => {
    if (!group) return null;
  
    return (
        <div style={styles.groupContainer} key={group.id}>
            <div style={styles.group}>{group.name || 'Unnamed Group'}</div>
            {group.subgroups && (group.subgroups.length >0) && <div style={styles.gg}>
            <div style={styles.groupChildren}>
            {/* {group.mastergroup && <RenderGroup group={group.mastergroup} />} */}
            {group.subgroups.map((sub) => <RenderGroup group={sub} key={sub.id} />)}
            </div>
            </div>}
        </div>
    );
};

export  const GroupSchema = ({ group }) => {
    if (!group) return null;
    if (group?.mastergroup) return <GroupSchema group={{...group?.mastergroup, subgroups: [group]}} />
    return <RenderGroup group={group} />
    // return (
    //     <div style={styles.groupContainer} key={group.id}>
    //         <div style={styles.group}>{group.name || 'Unnamed Group'}</div>
    //         <div style={styles.groupChildren}>
    //         {group.mastergroup && <GroupSchema group={group.mastergroup} />}
    //         {group.subgroups && group.subgroups.map((sub) => <GroupSchema group={sub} key={sub.id} />)}
    //         </div>
    //     </div>
    // );
};

const LoadGroupSchemaAsyncAction = createAsyncGraphQLAction(GROUP_QUERY)
export const GroupSchemaLazy = createLazyComponent(GroupSchema, "group", LoadGroupSchemaAsyncAction) 