// useAsyncThunkAction.test.jsx
import { renderHook, act } from "@testing-library/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../Store";
import { GQLClientContext } from "../Store"; // pokud ho exportuješ
import { useAsyncThunkAction } from "./useAsyncThunkAction";
import { createAsyncGraphQLAction2 } from "../Core/createAsyncGraphQLAction2";
import { createMockGqlClient } from "../../test/createMockGqlClient";

const wrapper = ({ children, client }) => (
    <ReduxProvider store={store}>
        <GQLClientContext.Provider value={client}>
            {children}
        </GQLClientContext.Provider>
    </ReduxProvider>
);

it("useAsyncThunkAction + createAsyncGraphQLAction2 používají klienta z kontextu", async () => {
    const mockClient = createMockGqlClient();

    const query = `
        query Me {
            me { id __typename name }
        }
    `;

    const AsyncAction = createAsyncGraphQLAction2(query);

    const { result } = renderHook(
        () => useAsyncThunkAction(AsyncAction),
        { wrapper: ({ children }) => wrapper({ children, client: mockClient }) }
    );

    const fakeResult = {
        data: { me: { id: "1", __typename: "User", name: "Tester" } },
    };
    mockClient.request.mockResolvedValueOnce(fakeResult);

    let out;
    await act(async () => {
        out = await result.current.run({});
    });

    expect(mockClient.request).toHaveBeenCalledWith({
        query,
        variables: {},
    });

    expect(out).toEqual(fakeResult); // nebo to, co middleware chain vrací
});
