import { ShaderAnimation } from "@/components/ui/shader-lines";

export default function ShaderLinesDemo() {
  return (
    <div className="relative flex h-[650px] w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-black border border-white/10">
      <ShaderAnimation/>
    </div>
  )
}
