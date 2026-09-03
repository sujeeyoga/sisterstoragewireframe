import { Link } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import { Button } from "@/components/ui/button";
import { Mail, PackageSearch } from "lucide-react";
import { Helmet } from "react-helmet-async";

const TrackingUnavailable = () => {
  return (
    <BaseLayout variant="standard" pageId="tracking-unavailable">
      <Helmet>
        <title>Order Updates by Email | Sister Storage</title>
        <meta
          name="description"
          content="Online order tracking is temporarily unavailable. We email your tracking number and carrier link as soon as your Sister Storage order ships."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <PackageSearch className="h-8 w-8 text-primary" />
            </span>
          </div>

          <h1 className="text-3xl font-bold text-foreground">Order updates by email</h1>

          <p className="text-muted-foreground">
            Online order tracking is temporarily turned off while we improve it. Nothing is lost —
            we email you a shipping confirmation with your tracking number and a direct carrier
            link as soon as your order leaves us.
          </p>

          <p className="text-sm text-muted-foreground">
            Can't find that email, or need an update sooner? Reach out and we'll look it up for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild>
              <a href="mailto:sisterstorageinc@gmail.com" className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email us about your order
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default TrackingUnavailable;
