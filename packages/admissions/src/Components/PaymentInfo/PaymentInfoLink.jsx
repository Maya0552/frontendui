import { ProxyLink } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that renders a `ProxyLink` to an paymentinfo view page.
 * 
 * The target URL is dynamically constructed using the `paymentinfo` object's `id`, 
 * and the link displays the `paymentinfo` object's `name` as its content.
 * 
 * @component
 * @param {Object} props - The properties for the PaymentInfoLink component.
 * @param {Object} props.paymentinfo - The object representing the paymentinfo entity.
 * @param {string|number} props.paymentinfo.id - The unique identifier for the paymentinfo entity.
 * @param {string} props.paymentinfo.name - The display name for the paymentinfo entity.
 * 
 * @returns {JSX.Element} A `ProxyLink` component linking to the paymentinfo view page.
 * 
 * @example
 * // Example usage:
 * const paymentinfoEntity = { id: 123, name: "Example PaymentInfo Entity" };
 * 
 * <PaymentInfoLink paymentinfo={paymentinfoEntity} />
 */
export const PaymentInfoLink = ({paymentinfo}) => {
    return <ProxyLink to={'/paymentinfo/paymentinfo/view/' + paymentinfo.id}>{paymentinfo.name}</ProxyLink>
}