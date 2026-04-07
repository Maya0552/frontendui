import { describe, it, expect } from "vitest";
import { createAsyncGraphQLAction2 } from "./createAsyncGraphQLAction2";
import { createMockGqlClient } from "../../test/createMockGqlClient";

describe("createAsyncGraphQLAction2 + mock client", () => {
    it("zavolá client.request s query a variables a projede middlewares", async () => {
        const mockClient = createMockGqlClient();

        const query = `
            query User($id: ID!) {
                user(id: $id) { id __typename name }
            }
        `;

        // jednoduchý middleware, který vybere data.user
        const selectUserMiddleware = (result) => (dispatch, getState, next) => {
            return next(result.data.user);
        };

        const AsyncAction = createAsyncGraphQLAction2(
            query,
            {}, // params
            selectUserMiddleware
        );

        const fakeResult = {
            data: {
                user: { id: "u1", __typename: "User", name: "Alice" },
            },
        };

        mockClient.request.mockResolvedValueOnce(fakeResult);

        const dispatch = vi.fn();
        const getState = vi.fn();

        const thunk = AsyncAction({ id: "u1" }, mockClient);
        const out = await thunk(dispatch, getState);

        expect(mockClient.request).toHaveBeenCalledWith({
            query,
            variables: { id: "u1" },
        });

        expect(out).toEqual({ id: "u1", __typename: "User", name: "Alice" });
    });
});
