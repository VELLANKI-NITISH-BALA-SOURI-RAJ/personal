import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Tabs,
  Tab,
  Paper,
  CircularProgress
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { getFundDetails } from '../services/fundService';
import type { FundDetails as FundDetailsType } from '../services/fundService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const FundDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [details, setDetails] = useState<FundDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (id) {
      getFundDetails(id).then(data => {
        setDetails(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  if (!details) {
    return <Typography>Fund details not found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Fund Details</Typography>

      {/* Summary Card */}
      <Card variant="outlined" sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <Typography color="textSecondary" variant="caption">Fund ID</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{details.summary.fundId}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <Typography color="textSecondary" variant="caption">Fund Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{details.summary.fundName}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <Typography color="textSecondary" variant="caption">Currency</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{details.summary.currency}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <Typography color="textSecondary" variant="caption">Status</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{details.summary.status}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <Typography color="textSecondary" variant="caption">Lock Status</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{details.summary.lock}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="fund details tabs">
            <Tab label="Overview" />
            <Tab label="Performance" />
            <Tab label="Holdings" />
            <Tab label="Audit" />
          </Tabs>
        </Box>
        
        <CustomTabPanel value={tabValue} index={0}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Overview</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}><b>Description:</b> {details.overview.description}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}><b>Inception Date:</b> {details.overview.inceptionDate}</Typography>
          <Typography variant="body2"><b>Total Assets:</b> {details.overview.totalAssets}</Typography>
        </CustomTabPanel>
        
        <CustomTabPanel value={tabValue} index={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Performance</Typography>
          {details.performance.map((p, i) => (
            <Typography key={i} variant="body2">Date: {p.date} - Return: {p.return}</Typography>
          ))}
        </CustomTabPanel>
        
        <CustomTabPanel value={tabValue} index={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Holdings</Typography>
          {details.holdings.map((h, i) => (
            <Typography key={i} variant="body2">{h.ticker} ({h.name}): {h.weight}</Typography>
          ))}
        </CustomTabPanel>
        
        <CustomTabPanel value={tabValue} index={3}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Audit Log</Typography>
          {details.audit.map((a, i) => (
            <Typography key={i} variant="body2">[{a.timestamp}] {a.user}: {a.action}</Typography>
          ))}
        </CustomTabPanel>
      </Paper>
    </Box>
  );
};
