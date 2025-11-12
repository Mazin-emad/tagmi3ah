import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircleIcon } from "@heroicons/react/24/solid";

export default function CheckoutFailure() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const sessionId = searchParams.get("session_id"); // Stripe session ID

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <XCircleIcon className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">
              Payment Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-lg text-muted-foreground">
                We couldn't process your payment.
              </p>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {decodeURIComponent(error)}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Please try again or use a different payment method.
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-muted/30">
              <h3 className="font-semibold mb-2">What you can do:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Check that your card details are correct</li>
                <li>Ensure you have sufficient funds</li>
                <li>Try a different payment method</li>
                <li>Contact your bank if the problem persists</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button asChild>
                <Link to="/checkout">Try Again</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>

            {sessionId && (
              <div className="text-center pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Session ID: {sessionId}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  If you continue to experience issues, please contact support
                  with this session ID.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

