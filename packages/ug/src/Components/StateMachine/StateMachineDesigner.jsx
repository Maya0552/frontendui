import { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { InsertStateButton } from '../State/InsertStateButton'
import { DeleteStateTransitionButton, InsertStateTransitionButton, StateMachineReadAsyncAction, UpdateStateTransitionButton } from '../StateTransition'
import { useAsyncAction } from '@hrbolek/uoisfrontend-gql-shared'
import { LeftColumn, MiddleColumn, SimpleCardCapsule } from '@hrbolek/uoisfrontend-shared'
import { PencilFill, PlusLg, TrashFill } from 'react-bootstrap-icons'
import { UpdateStateButton } from '../State/UpdateStateButton'
import { DeleteStateButton } from '../State/DeleteStateButton'

const Transition = ({statemachine, transition, onChange, onTransitionClick=()=>null, ...props}) => {
    transition = statemachine?.transitions.find(
        t => t.id === transition.id
    )
    return (
        <span className="btn btn-sm btn-light">
            <span className="btn btn-sm btn-outline-primary" onClick={()=>onTransitionClick(transition)}>
                {transition.name}&nbsp;({transition?.target?.name})
            </span>
            
            <UpdateStateTransitionButton 
                className="btn btn-sm btn-outline-success"
                statetransition={{
                    ...transition, 
                    statemachine: statemachine, 
                    target_id: transition.target.id, 
                    source_id: transition.source.id
                }}
                onDone={onChange}
            >
                <PencilFill />
            </UpdateStateTransitionButton>
            
            <DeleteStateTransitionButton 
                className="btn btn-sm btn-outline-danger"
                statetransition={transition}
                onDone={onChange}
            >
                <TrashFill /> 
            </DeleteStateTransitionButton>
            
        </span>
    )
}

const TransitionList = ({statemachine, transitions, children, onTransitionClick, onChange, ...props}) => {
    return (<>
        {transitions.map(transition => 
            <Transition 
                key={transition.id}     
                statemachine={statemachine} 
                {...props} 
                transition={transition}
                onTransitionClick={onTransitionClick}
                onChange={onChange}
            />
        )}
        {children}
    </>)
}


export const StateTransitionsDesigner = ({state={}, statemachine, onTransitionClick, onStateSwitch=(state)=>null, onChange=()=>null}) => {
    const {sources=[], targets=[]} = state
    const handleNewTransition = (transition) => {
        onChange()
    }

    const handleTransitionClick = (transition) => {
        const state = transition.target
        onStateSwitch(state)
    }

    const outcomming = statemachine?.transitions?.filter(
        transition => transition?.source?.id === state?.id
    ) 
    if (statemachine.states.length === 0) {
        return null
    }
    return (<>
        
        <TransitionList 
            statemachine={statemachine} 
            transitions={outcomming} 
            className="btn btn-sm btn-outline-secondary" 
            onTransitionClick={handleTransitionClick}
            onChange={onChange}
        />
        <InsertStateTransitionButton  
            className="btn btn-sm btn-outline-secondary" 
            params={{
                statemachine_id: statemachine.id,
                source_id: state.id,
                statemachine: statemachine
            }}
            onDone={handleNewTransition}
        >
            <PlusLg /> Nový přechod
        </InsertStateTransitionButton>
        {/* {state.id} */}
  </>)
}

export const StateDesigner = ({state, statemachine, onTransitionClick, onChange=()=>null}) => {
    const {sources=[], targets=[]} = state
    const handleNewTransition = (transition) => {
        onChange()
    }
    const incomming = statemachine?.transitions?.filter(
        transition => transition?.target?.id === state?.id
    )
    const outcomming = statemachine?.transitions?.filter(
        transition => transition?.source?.id === state?.id
    ) 
    return (
        <Row>
            <Col>
                <SimpleCardCapsule title={"Vstupy"}>
                    <TransitionList 
                        statemachine={statemachine} 
                        transitions={incomming} 
                        className="btn btn-sm btn-outline-secondary" 
                        onChange={onChange}
                        // onTransitionClick={onTransitionClick}
                    />
                </SimpleCardCapsule>
            </Col>
            <Col>
                <SimpleCardCapsule title="Výstupy">
                    <InsertStateTransitionButton  
                        className="btn btn-sm btn-outline-secondary" 
                        params={{
                            statemachine_id: statemachine.id,
                            source_id: state.id,
                            statemachine: statemachine
                        }}
                        onDone={handleNewTransition}
                    >
                        <PlusLg />
                    </InsertStateTransitionButton>
                    <TransitionList 
                        statemachine={statemachine} 
                        transitions={outcomming} 
                        className="btn btn-sm btn-outline-secondary" 
                        onTransitionClick={onTransitionClick}
                        onChange={onChange}
                    />
                    {/* {state.id} */}
                </SimpleCardCapsule>
            </Col>
        </Row>
    // <Row>
    //     <Col xs={5} className='text-end'>
    //         <TransitionList 
    //             statemachine={statemachine} 
    //             transitions={sources} 
    //             className="btn btn-sm btn-outline-secondary" 
    //             onChange={onChange}
    //         />
    //     </Col>
    //     <Col  className='text-center'>
    //         <span className="btn btn-sm btn-light">
    //             <DeleteStateButton 
    //                 className="btn btn-sm btn-outline-danger"
    //                 state={state}
    //                 onDone={onChange}
    //             >
    //                 <TrashFill />
    //             </DeleteStateButton>
    //             <UpdateStateButton 
    //                 className="btn btn-sm btn-outline-success"
    //                 state={state}
    //                 onDone={onChange}
    //             >
    //                 <PencilFill />
    //             </UpdateStateButton>
    //             &nbsp;{state?.name}
    //         </span>
    //         </Col>
    //     <Col xs={5} className='text-start'>
    //         <InsertStateTransitionButton  
    //             className="btn btn-sm btn-outline-secondary" 
    //             params={{
    //                 statemachine_id: statemachine.id,
    //                 source_id: state.id,
    //                 statemachine: statemachine
    //             }}
    //             onDone={handleNewTransition}
    //         >
    //             <PlusLg />
    //         </InsertStateTransitionButton>
    //         <TransitionList statemachine={statemachine} transitions={targets} className="btn btn-sm btn-outline-secondary" />
    //     </Col>
    // </Row>
    )
}

export const StateMachineDesigner = ({statemachine, children, onChange=()=>null}) => {
    const {states=[]} = statemachine
    const [activeIndex, setActiveIndex] = useState(0)
    const activeState = states[activeIndex]
    const handleFollowTransition = (transition) => {
        console.log("handleFollowTransition", transition)
        const targetId = transition.target.id
        const target = states.find(state => state.id === targetId)
        const newIndex = states.indexOf(target)
        if ((newIndex === 0) | (newIndex)) {
          setActiveIndex(prev => newIndex)
        }
    }
    const handleStateSwitch = (state) => {
        const index = states.findIndex(item => item.id === state.id)
        setActiveIndex(prev => index)
    }
    return (
        <Row>
            <LeftColumn>
                <VerticalArcGraph statemachine={statemachine} activeNodeId={activeState?.id}/>
            </LeftColumn>
            <MiddleColumn>
                {/* <div>
                    {JSON.stringify(statemachine?.states)}
                </div>
                <div>
                    {JSON.stringify(statemachine?.transitions)}
                </div> */}
                
                <StateMachineSwitch states={states} onStateSwitch={handleStateSwitch} />
                <span className='btn btn-light'>
                    <InsertStateButton 
                        className="btn btn-sm btn-outline-secondary" 
                        params={{
                            statemachine_id: statemachine.id
                        }}
                        onDone={onChange}
                    >
                        Nový stav
                    </InsertStateButton>
                </span>
                {activeState && <StateDesigner state={activeState} statemachine={statemachine} onChange={onChange} onTransitionClick={handleFollowTransition}/>}
            </MiddleColumn>
          </Row>

    )
}

export const StateMachineSwitch = ({state={}, statemachine, onStateSwitch=(state=>null), onChange, children}) => {
    const {states} = statemachine

    return (<>
        {states.map((currentState, index) => <span key={currentState.id}
          className={"btn btn-light"}
        >
            <span
                className={currentState === state ? 'btn btn-sm btn-primary' : "btn btn-sm btn-outline-primary"}
                onClick={() => onStateSwitch(currentState)}
            >
                {currentState?.name}
            </span>
            <UpdateStateButton
                className="btn btn-sm btn-outline-success"
                state={currentState}
                onDone={onChange}
            >
                <PencilFill />
            </UpdateStateButton>
            <DeleteStateButton
                className="btn btn-sm btn-outline-danger"
                state={currentState}
                onDone={onChange}
            >
                <TrashFill />
            </DeleteStateButton>
            
        </span>
        )}
        <InsertStateButton
            className={"btn btn-sm btn-outline-secondary"}
            params={{statemachine_id: statemachine.id}}
            onDone={onChange}
        >
            <PlusLg/> Nový stav
        </InsertStateButton>
        
    </>)
}

/**
 * A helper to create a cubic Bézier path that arcs to the left.
 * We place control points at (x-r, startY) and (x-r, endY),
 * so it curves out to the left by "r" in the X direction.
 *
 * @param {number} x      The center X for both start and end
 * @param {number} startY The arc start Y
 * @param {number} endY   The arc end Y
 * @returns {string}      The "d" attribute for the <path>
 */
function cubicArcLeft(x, startY, endY) {
    const dy = endY - startY;
    // radius is half the vertical distance
    // (negative sign just flips the direction for the control points)
    const r = -(dy) / 2;

    // We always arc left, so the control points are offset by -r in the X direction.
    // M (x, startY)
    //   C (x - r, startY) -> (x - r, endY) -> (x, endY)
    return `
        M ${x},${startY}
        C ${x - r},${startY}
          ${x - r},${endY}
          ${x},${endY}
    `;
}

/**
* VerticalArcGraph
*  - Renders a vertical list of rectangular nodes, spaced evenly.
*  - Draws arcs for edges that bend left.
*  - If source's index < target's index => arc from top of source to bottom of target.
*  - Otherwise => arc from bottom of source to top of target.
*  - Highlights an 'active' node (and its outgoing edges) with a different color.
*
* @param {Object} props
* @param {Object} props.statemachine An object like:
*   {
*     states: [{ id, name }, ...],
*     transitions: [{ source: { id }, target: { id }, name: "..."}],
*   }
* @param {string} [activeNodeId] The ID of the active node (optional).
*/
export function VerticalArcGraph({ statemachine, activeNodeId=0 }) {
    const { states: nodes, transitions: edges } = statemachine;

    // Layout constants
    const NODE_WIDTH = 100;      // rectangle width
    const NODE_HEIGHT = 30;      // rectangle height
    const SPACING = 80;          // vertical space between node centers
    const START_Y = 40;          // y offset for the first node

    // 1) Build an index map so we know each node's vertical "index" (top to bottom).
    const nodeIndexMap = new Map();
    nodes.forEach((node, i) => nodeIndexMap.set(node.id, i));

    // 2) Precompute each node's vertical center (y). We'll fill x=0 for now.
    //    We'll compute the real x after we know the svgWidth.
    const positions = {};
    nodes.forEach((node, i) => {
        positions[node.id] = {
            x: 0, // placeholder
            y: START_Y + i * SPACING
        };
    });

    // 3) Figure out the maximum vertical distance among all edges
    //    so we can scale the svgWidth accordingly.
    let largestDistance = 0;

    edges.forEach((edge) => {
        const sIndex = nodeIndexMap.get(edge.source.id);
        const tIndex = nodeIndexMap.get(edge.target.id);
        if (sIndex === undefined || tIndex === undefined) return;

        const sourcePos = positions[edge.source.id];
        const targetPos = positions[edge.target.id];

        let startY, endY;
        if (sIndex < tIndex) {
            // arc from top of source to bottom of target
            startY = sourcePos.y - NODE_HEIGHT / 2;
            endY = targetPos.y + NODE_HEIGHT / 2;
        } else {
            // arc from bottom of source to top of target
            startY = sourcePos.y + NODE_HEIGHT / 2;
            endY = targetPos.y - NODE_HEIGHT / 2;
        }

        const dist = Math.abs(endY - startY);
        if (dist > largestDistance) {
            largestDistance = dist;
        }
    });

    // 4) Now compute svgWidth based on largestDistance (multiply by some factor).
    //    Also ensure a minimum width of 400 so it's not too small.
    // const svgWidth = Math.max(400, 100 + largestDistance * 1.5);
    // const svgWidth = Math.sqrt(largestDistance * largestDistance - 100 * largestDistance);
    const svgWidth = Math.max(largestDistance, 400);

    // 5) Update each node's x position to be at the center horizontally
    nodes.forEach((node) => {
        positions[node.id].x = svgWidth / 2;
    });

    // 6) Compute the overall SVG height
    const svgHeight = START_Y + (nodes.length - 1) * SPACING + 50;

    // Helper to get fill color for a node
    const getNodeFill = (nodeId) => {
        return nodeId === activeNodeId ? "orange" : "steelblue";
    };

    // Helper to get stroke color for an edge
    const getEdgeStroke = (edge) => {
        return edge.source.id === activeNodeId ? "orange" : "black";
    };

    return (
        <svg
            // width={svgWidth}
            // height={svgHeight}
            style={{ 
                border: "1px solid #ccc", 
                background: "#f9f9f9",
                maxWidth: "100%",
                // height: "auto",
                display: "block"
            }}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
            {/*
                (1) Draw edges:
                - If sourceIndex < targetIndex => arc from top of source -> bottom of target
                - Else => arc from bottom of source -> top of target
            */}
            {edges.map((edge, i) => {
                const sIndex = nodeIndexMap.get(edge.source.id);
                const tIndex = nodeIndexMap.get(edge.target.id);
                if (sIndex === undefined || tIndex === undefined) return null;

                const sourcePos = positions[edge.source.id];
                const targetPos = positions[edge.target.id];

                let startY, endY;
                if (sIndex < tIndex) {
                    startY = sourcePos.y - NODE_HEIGHT / 2.5;
                    endY = targetPos.y + NODE_HEIGHT / 2.5;
                } else {
                    startY = sourcePos.y + NODE_HEIGHT / 2.5;
                    endY = targetPos.y - NODE_HEIGHT / 2.5;
                }

                const d = cubicArcLeft(sourcePos.x, startY, endY);
                const strokeColor = getEdgeStroke(edge);

                return (
                    <g key={`edge-${i}`}>
                        <path
                            d={d}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="2"
                        />
                        {/* If we want to display the edge name, let's place it roughly halfway. */}
                        {edge.name && (
                            <text
                                // approximate the midpoint in Y
                                x={sourcePos.x + (endY - startY) / 3}
                                y={(startY + endY) / 2}
                                textAnchor="middle"
                                fontSize="12"
                                fill={strokeColor}
                                style={{ userSelect: "none" }}
                            >
                                {edge.name}
                            </text>
                        )}
                    </g>
                );
            })}

            {/* (2) Draw Nodes as rectangles */}
            {nodes.map((node) => {
                const { x, y } = positions[node.id];
                const fillColor = getNodeFill(node.id);
                return (
                    <g key={node.id}>
                        <rect
                            x={x - NODE_WIDTH / 2}
                            y={y - NODE_HEIGHT / 2}
                            width={NODE_WIDTH}
                            height={NODE_HEIGHT}
                            rx="4" // slight rounding
                            ry="4"
                            fill={fillColor}
                            stroke="#333"
                            strokeWidth="1"
                        />
                        <text
                            x={x}
                            y={y}
                            fill="white"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="14"
                        >
                            {node.name}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
