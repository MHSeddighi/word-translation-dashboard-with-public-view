import ThemeToggler from "../../components/ThemeToggler";

function Header() {
  return (
    <div
      className="mb-4 flex justify-between px-4 rounded-lg bg-background items-center "
      style={{
        background:
          "linear-gradient(to right,var(--mui-background-default),var(--mui-secondary-dark),var(--mui-background-default))",
      }}
    >
      <h2>فروشگاه کتاب</h2>
      <ThemeToggler />
    </div>
  );
}

export default Header;
