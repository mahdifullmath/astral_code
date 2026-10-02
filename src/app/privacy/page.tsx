export const metadata = { title: "Privacy Policy" };
export default function Privacy() {
  return (
    <div className="container-page py-16 max-w-3xl">
      <h1 className="heading-display text-4xl mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-ink-soft">
        <p>Astral Code collects the minimum data needed to operate your account: username, email address, and play-session data used for leaderboards and coin rewards.</p>
        <h2 className="heading-display text-xl mt-6">What we collect</h2>
        <p>Account data (username, email, password hash). Play sessions (duration, game, location hash). Wallet and coin transaction history.</p>
        <h2 className="heading-display text-xl mt-6">What we do not collect</h2>
        <p>We do not sell personal data. Astral Coins have no cash value and cannot be exchanged for money.</p>
        <h2 className="heading-display text-xl mt-6">Your rights</h2>
        <p>You may request deletion of your account and all associated data at any time by contacting us.</p>
        <p className="text-ink-faint text-sm mt-8">Last updated 2026. In-game currency — no cash value.</p>
      </div>
    </div>
  );
}
