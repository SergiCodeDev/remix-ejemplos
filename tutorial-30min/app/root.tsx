// La ruta de la raíz de REMIX
import { json, redirect } from "@remix-run/node";
import type { LinksFunction, LoaderFunctionArgs, } from "@remix-run/node";
import {
  Form,
  // Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import appStylesHref from "./app.css?url";
import { createEmptyContact, getContacts } from "./data";
import { useEffect, useState } from "react";

export const action = async () => {
  const contact = await createEmptyContact();
  // return json({ contact });
  return redirect(`/contacts/${contact.id}/edit`);
};

// Agregar hojas de estilo con links
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

// Cargar datos desde el servidor
// export const loader = async () => {
//   const contacts = await getContacts();
//   return json({ contacts });
//   // return Response.json({ contacts });
// };

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};

export default function App() {
  // const { contacts } = useLoaderData<typeof loader>(); // Cargar datos en el cliente desde loader
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation(); // devuelve el estado de navegación actual: puede ser uno de "idle", "loading" o "submitting"
  const submit = useSubmit(); // busqueda instantanea
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  // useEffect(() => {
  //   const searchField = document.getElementById("q");
  //   if (searchField instanceof HTMLInputElement) {
  //     searchField.value = q || "";
  //   }
  // }, [q]);

    // the query now needs to be kept in state
    const [query, setQuery] = useState(q || "");

    // we still have a `useEffect` to synchronize the query
    // to the component state on back/forward button clicks
    useEffect(() => {
      setQuery(q || "");
    }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form 
            id="search-form" 
            // busqueda instantanea
            onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
              role="search">
              <input
                id="q"
                defaultValue={q || ""}
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                className={searching ? "loading" : ""}
                // synchronize user's input to component state
                onChange={(event) =>
                  setQuery(event.currentTarget.value)
                }
                // switched to `value` from `defaultValue`
                value={query}
              />
              <div id="search-spinner" aria-hidden hidden={!searching} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
          {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    {/* <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </Link> */}
                    <NavLink
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                      ? "pending"
                      : ""
                  }
                  to={`contacts/${contact.id}`}
                >
                  {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div 
        className={
          navigation.state === "loading" && !searching ? "loading" : ""
          } 
          id="detail"
          >
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
