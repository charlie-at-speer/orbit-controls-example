import ReactDOM from "react-dom"
import React, { Suspense, useEffect, useRef } from "react"
import { Canvas, useFrame, useLoader, useThree } from "react-three-fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Controls, useControl } from "react-three-gui"
import { OrbitControls, TransformControls, StandardEffects } from "drei"
import "./styles.css"

function Keen() {
  const orbit = useRef()
  const transform = useRef()
  const mode = useControl("mode", { type: "select", items: ["scale", "rotate", "translate"] })
  const { nodes, materials } = useLoader(GLTFLoader, "/scene.gltf")
  useEffect(() => {
    if (transform.current) {
      const controls = transform.current
      controls.setMode(mode)
      const callback = event => (orbit.current.enabled = !event.value)
      controls.addEventListener("dragging-changed", callback)
      return () => controls.removeEventListener("dragging-changed", callback)
    }
  })
  const {camera} = useThree()
  useFrame(() => {
    console.log(camera.quaternion)
  })

  return (
    <>
      <TransformControls ref={transform}>
        <group position={[0, -7, 0]} rotation={[-Math.PI / 2, 0, 0]} dispose={null}>
          <mesh material={materials["Scene_-_Root"]} geometry={nodes.mesh_0.geometry} castShadow receiveShadow />
        </group>
      </TransformControls>
      <OrbitControls ref={orbit} />
    </>
  )
}

function App() {
  return (
    <>
      <Canvas shadowMap camera={{ position: [0, 0, 17], far: 50}}>
        <ambientLight />
        <spotLight
          intensity={2}
          position={[40, 50, 50]}
          shadow-bias={-0.00005}
          penumbra={1}
          angle={Math.PI / 6}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          castShadow
        />
        <Suspense fallback={null}>
          <Keen/>
          <StandardEffects />
        </Suspense>
      </Canvas>
      <Controls />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
