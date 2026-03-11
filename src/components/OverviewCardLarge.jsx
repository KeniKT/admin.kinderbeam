// ---------------------------------------------------------------
// src/components/OverviewCardLarge.jsx
// Large stat card used on the Dashboard page.
// ---------------------------------------------------------------

export default function OverviewCardLarge({ count, name }) {
  return (
    <div className="flex flex-row items-end gap-4">
      <p className="text-7xl font-normal text-dark-cream text-right">{count}</p>
      <p className="text-xl py-2 text-left">{name}</p>
    </div>
  );
}