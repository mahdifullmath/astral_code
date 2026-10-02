export const metadata = { title: "Terms of Service" };
export default function Terms() {
  return (
    <div className="container-page py-16 max-w-3xl">
      <h1 className="heading-display text-4xl mb-6">Terms of Service</h1>
      <div className="space-y-4 text-ink-soft">
        <p>By using Astral Code you agree to these terms. Astral Games are AR experiences that use your camera, microphone, gyroscope, and GPS. Use them responsibly and in safe environments.</p>
        <h2 className="heading-display text-xl mt-6">Accounts</h2>
        <p>You are responsible for the security of your account. Use a strong, unique password.</p>
        <h2 className="heading-display text-xl mt-6">Astral Coins</h2>
        <p>Astral Coins are in-game currency earned by playing. They have no cash value and cannot be transferred, sold, or exchanged for money or goods outside the platform.</p>
        <h2 className="heading-display text-xl mt-6">Fair play</h2>
        <p>Coins are awarded only by the server after validated game events. Cheating, automation, or abuse may result in account suspension.</p>
        <p className="text-ink-faint text-sm mt-8">Last updated 2026.</p>
      </div>
    </div>
  );
}
