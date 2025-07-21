import Sidebaradmin from "./Sidebaradmin";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebaradmin />
      <main className="flex-grow p-6">{children}</main>
    </div>
  );
}
