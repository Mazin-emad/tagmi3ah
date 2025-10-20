import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type PartCardProps = {
  title: string;
  image: string;
  description?: string;
};

export function PartCard({
  title,
  image,
  description = "Add, compare, or configure this part.",
}: PartCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-4">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="mx-6 mb-4 overflow-hidden rounded-md border">
          <div className="aspect-video bg-muted/40">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
