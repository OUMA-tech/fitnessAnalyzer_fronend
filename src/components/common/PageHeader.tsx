import { Box, Typography } from '@mui/material';


interface PageHeaderProps {
    title: string;
    subTitle?: string;
}

const PageHeader = ({title, subTitle}: PageHeaderProps) => {
    return (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Box>
              <Typography variant="h4" component="h1">
                {title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {subTitle}
              </Typography>
            </Box>
          </Box>
        </Box>
      )
}

export default PageHeader