import { toast } from "sonner"
import { Button } from "./components/ui/button"



function App() {
 

  return (
    <>
      <Button variant={"destructive"}>Click me</Button>
       <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created")
      }
    >
      Show Toast
    </Button>
      
    </>
  )
}

export default App
