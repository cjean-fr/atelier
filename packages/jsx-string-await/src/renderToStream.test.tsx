import { Await } from "./Await.js";
import { renderToStream } from "./renderToStream.js";
import { htmxStrategy } from "./strategies.js";
import { withContext, useContext } from "@cjean-fr/jsx-string";
import { describe, it, expect, mock } from "bun:test";

declare module "@cjean-fr/jsx-string" {
  interface Context {
    name?: string;
    value?: string;
  }
}

async function streamToString(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  return result;
}

describe("jsx-string Context Architecture", () => {
  it("should isolate contexts with interleaved async operations", async () => {
    const p1 = withContext(async () => {
      await new Promise((r) => setTimeout(r, 20));
      useContext().name = "Christophe";
      await new Promise((r) => setTimeout(r, 20));
      return useContext().name;
    });

    const p2 = withContext(async () => {
      await new Promise((r) => setTimeout(r, 5));
      useContext().name = "Anna";
      await new Promise((r) => setTimeout(r, 20));
      return useContext().name;
    });

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toBe("Christophe");
    expect(r2).toBe("Anna");
  });

  it("should work with synchronous callbacks", async () => {
    const result = await withContext(() => {
      useContext().value = "sync";
      return useContext().value;
    });
    expect(result).toBe("sync");
  });

  it("should create entirely new sandbox for nested withContext", async () => {
    const parent = await withContext(async () => {
      useContext().value = "parent";

      const child = await withContext(async () => {
        useContext().value = "child";
        return useContext().value;
      });

      expect(child).toBe("child");
      expect(useContext().value).toBe("parent");
      return useContext().value;
    });

    expect(parent).toBe("parent");
  });
});

describe("jsx-string-await Plugin", () => {
  it("should render fallback first and resolve correctly", async () => {
    const App = () => (
      <div>
        <Await id="test-1" fallback={<span>Loading...</span>}>
          {async () => {
            await new Promise((r) => setTimeout(r, 10));
            return <span>Resolved!</span>;
          }}
        </Await>
      </div>
    );

    const stream = renderToStream(() => <App />, { strategy: htmxStrategy });
    const result = await streamToString(stream);

    expect(result).toContain(
      '<div><div id="test-1"><span>Loading...</span></div></div>',
    );
    expect(result).toContain(
      '<div id="test-1" hx-swap-oob="true"><span>Resolved!</span></div>',
    );
  });

  it("should handle error gracefully", async () => {
    const App = () => (
      <Await
        id="test-error"
        fallback={<span>Loading...</span>}
        errorFallback={<span>Error occurred</span>}
      >
        {async () => {
          throw new Error("Failed");
        }}
      </Await>
    );

    const stream = renderToStream(() => <App />, { strategy: htmxStrategy });
    const result = await streamToString(stream);

    expect(result).toContain(
      '<div id="test-error"><span>Loading...</span></div>',
    );
    expect(result).toContain(
      '<div id="test-error" hx-swap-oob="true"><span>Error occurred</span></div>',
    );
  });

  it("should handle timeout correctly", async () => {
    const onTimeout = mock(() => {});

    const App = () => (
      <Await
        id="test-timeout"
        fallback={<span>Loading...</span>}
        errorFallback={<span>Timed out</span>}
        timeout={5}
        onTimeout={onTimeout}
      >
        {async () => {
          await new Promise((r) => setTimeout(r, 50));
          return <span>Too late!</span>;
        }}
      </Await>
    );

    const stream = renderToStream(() => <App />, { strategy: htmxStrategy });
    const result = await streamToString(stream);

    expect(result).toContain(
      '<div id="test-timeout"><span>Loading...</span></div>',
    );
    expect(result).toContain(
      '<div id="test-timeout" hx-swap-oob="true"><span>Timed out</span></div>',
    );
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });
});
