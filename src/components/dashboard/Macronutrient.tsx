import { Box, LinearProgress, Tooltip, Typography } from '@mui/material';

interface MacronutrientProps {
  title: string;
  percentage: number;
  color: string;
  explanation: string;
}

const Macronutrient = ({
  title,
  percentage,
  color,
  explanation
}: MacronutrientProps) => (
  <Tooltip title={explanation}>
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: `${color}20`,
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
              },
            }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(percentage)}%`}</Typography>
        </Box>
      </Box>
    </Box>
  </Tooltip>
);

export default Macronutrient; 