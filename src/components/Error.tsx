import { Search } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
interface ErrorProps {
  errorTitle: string;
  errorDescription: string;
  isLinkAvailable?:boolean;
  linkTitle?:string,
  href?:string
}
const Error = ({ errorTitle, errorDescription ,isLinkAvailable=false, linkTitle="",href="/"}: ErrorProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border p-8 text-center">
      <div className="text-error mb-4">
        <Search className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-card-foreground mb-2">
        {errorTitle}
      </h3>
      <p className="text-muted-foreground">{errorDescription}</p>
      {
        isLinkAvailable && <Link to={`/${href}`}>
        <Button variant="outline">{linkTitle}</Button>
      </Link>
      }
    </div>
  );
};

export default Error;
