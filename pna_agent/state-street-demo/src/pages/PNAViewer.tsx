import React, { useState, useEffect } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getSponsors } from '../services/sponsorService';
import type { Sponsor } from '../services/sponsorService';

export const PNAViewer: React.FC = () => {
  const [serverName, setServerName] = useState('');
  const [clientName, setClientName] = useState('');
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If Server Name is cleared, clear Client Name and sponsors
    if (!serverName) {
      setClientName('');
      setSponsors([]);
    }
  }, [serverName]);

  useEffect(() => {
    if (serverName && clientName) {
      setLoading(true);
      getSponsors(serverName, clientName).then((data) => {
        setSponsors(data);
        setLoading(false);
      });
    } else {
      setSponsors([]);
    }
  }, [serverName, clientName]);

  const handleRowClick = (sponsor: Sponsor) => {
    navigate('/fund-insights', { 
      state: { 
        clientName, 
        sponsorId: sponsor.id, 
        sponsorName: sponsor.name 
      } 
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="server-name-label">Server Name</InputLabel>
          <Select
            labelId="server-name-label"
            id="server-name-select"
            value={serverName}
            label="Server Name"
            onChange={(e) => setServerName(e.target.value)}
            inputProps={{ 'aria-label': 'Server Name' }}
          >
            <MenuItem value="20PAW3">20PAW3</MenuItem>
            <MenuItem value="22PAW3">22PAW3</MenuItem>
            <MenuItem value="24PAW3">24PAW3</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} size="small" disabled={!serverName}>
          <InputLabel id="client-name-label">Client Name</InputLabel>
          <Select
            labelId="client-name-label"
            id="client-name-select"
            value={clientName}
            label="Client Name"
            onChange={(e) => setClientName(e.target.value)}
            inputProps={{ 'aria-label': 'Client Name' }}
          >
            <MenuItem value="UAT Test Sponsor">UAT Test Sponsor</MenuItem>
            <MenuItem value="Demo Sponsor">Demo Sponsor</MenuItem>
            <MenuItem value="Production Sponsor">Production Sponsor</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : sponsors.length > 0 ? (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 0 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Sponsor Id</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Sponsor Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sponsors.map((row) => (
                <TableRow 
                  key={row.id}
                  hover
                  onClick={() => handleRowClick(row)}
                  sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </Box>
  );
};
