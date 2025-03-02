import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

export default function Login() {

  return (
    <div className="flex w-full gap-4 p-4 justify-center h-screen items-center" >
      <div className="w-1/2"> hhh </div>
      <form className="flex flex-col justify-center items-center gap-10 w-1/2 bg-primary/50 p-4 rounded-xl " >
        Login
        <Input className="mt-4 w-3/4 bg-secondary " type="text" placeholder="Username"  />
        <Button type={"submit"} >Login</Button>
      </form>

    </div>
  )
}