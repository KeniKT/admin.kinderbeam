// ---------------------------------------------------------------
// src/components/OverviewCardSmall.jsx
// Small stat card used on the Dashboard page.
// ---------------------------------------------------------------

export default function OverviewCardSmall({ count, name }) {
  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-4xl font-normal text-dark-cream">{count}</p>
      <p>{name}</p>
    </div>
  );
}