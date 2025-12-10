export const withUI =
    (UI) =>
    (Component) =>
    (props) =>
        Component({ UI, ...props });

export const withLockedUI =
    (_UI) =>
    (Component) =>
    ({ UI, ...props }) =>
        Component({UI: _UI, ...props});


const Dummy = ({UI, item}) => null
const DummyUISet = {
    Link: Dummy,
    CardCapsule: Dummy,
    MediumCard: Dummy,
    LargeCard: Dummy,
    MediumContent: Dummy,
    MediumEditableContent: Dummy,
    Page: Dummy
}

const bindUISet = (spec) => ({
    Link: withUI(spec)(spec.Link),
    CardCapsule: withUI(spec)(spec.CardCapsule),
    MediumCard: withUI(spec)(spec.MediumCard),
    LargeCard: withUI(spec)(spec.LargeCard),
    MediumContent: withUI(spec)(spec.MediumContent),
    MediumEditableContent: withUI(spec)(spec.MediumEditableContent),
    Page: withUI(spec)(spec.Page),
});

export const inheritUI = (child = {}, parent=DummyUISet) => {
    const ui = { ...parent, ...child };
    return bindUISet(ui);
};