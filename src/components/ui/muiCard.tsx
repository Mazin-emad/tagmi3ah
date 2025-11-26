import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';

interface MainCardProps {
  img: { img: string };
}

export default function MainCard({ img }: MainCardProps) {
  return (
    <Card sx={{ maxWidth: 345, maxHeight: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={img.img}
          alt="Product image"
        />
      </CardActionArea>
    </Card>
  );
}