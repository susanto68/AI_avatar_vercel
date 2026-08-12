// Animated star/planet/comet backdrop, ported from Ganguly's Notes
// (sirganguly.com). Pure CSS animation — see styles/space-background.css.
// Render as the first child of a `relative` container, followed by a
// `relative z-10` wrapper around the real page content.
export default function SpaceBackground() {
  return (
    <div className="universe-bg" aria-hidden="true">
      <div className="stars-layer-1" />
      <div className="stars-layer-2" />
      <div className="globe-mesh">
        <div className="mesh-circle circle-1" />
        <div className="mesh-circle circle-2" />
        <div className="mesh-circle circle-3" />
        <div className="mesh-line line-h" />
        <div className="mesh-line line-v" />
        <div className="mesh-line line-d1" />
        <div className="mesh-line line-d2" />
      </div>
      <div className="planet-earth" />
      <div className="planet-saturn">
        <div className="saturn-rings" />
      </div>
      <div className="planet-mercury" />
      <div className="planet-jupiter" />
      <div className="planet-venus" />
      <div className="planet-mars" />
      <div className="planet-uranus">
        <div className="uranus-rings" />
      </div>
      <div className="planet-neptune" />
      <div className="comet-1" />
      <div className="comet-2" />
      <div className="comet-3" />
      <div className="comet-4" />
    </div>
  )
}
