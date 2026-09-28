import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  TextField,
  Paper,
  Link as MuiLink
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFunds } from '../services/fundService';
import type { Fund } from '../services/fundService';

export const FundInsights: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { clientName?: string, sponsorId?: string, sponsorName?: string } || {};
  
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // Dummy filter states
  const [filters, setFilters] = useState({
    type: '', frequency: '', period: '', date: '', status: '', data: '', lock: '', entity: ''
  });

  useEffect(() => {
    getFunds(state.sponsorId || '').then(data => {
      setFunds(data);
      setLoading(false);
    });
  }, [state.sponsorId]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const columns: GridColDef[] = [
    { field: 'fundType', headerName: 'Fund Type', flex: 1 },
    { field: 'frequency', headerName: 'Fund Daily/Monthly', flex: 1 },
    { 
      field: 'fundId', 
      headerName: 'Fund ID', 
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <MuiLink 
          component="button"
          variant="body2"
          onClick={() => navigate(`/fund-details/${params.value}`)}
          sx={{ textAlign: 'left', fontWeight: 'medium' }}
        >
          {params.value}
        </MuiLink>
      )
    },
    { field: 'fundName', headerName: 'Fund Name', flex: 1.5 },
    { field: 'currency', headerName: 'Base Currency', flex: 1 },
    { field: 'status', headerName: 'Data Status', flex: 1 },
    { field: 'lock', headerName: 'Lock Status', flex: 1 },
  ];

  const filteredFunds = funds.filter(fund => {
    if (!searchText) return true;
    const lowerSearch = searchText.toLowerCase();
    return Object.values(fund).some(val => 
      String(val).toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Fund Insights</Typography>
      
      <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
        <Typography variant="body2">Client: <b>{state.clientName || 'UAT Test Sponsor'}</b></Typography>
        <Typography variant="body2">Sponsor: <b>{state.sponsorName || 'SSIA UAT Super Sponsor Long Name'}</b></Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select value={filters.type} label="Type" onChange={e => handleFilterChange('type', e.target.value)}>
            <MenuItem value="Portfolio">Portfolio</MenuItem>
            <MenuItem value="Aggregate">Aggregate</MenuItem>
            <MenuItem value="All">All</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Frequency</InputLabel>
          <Select value={filters.frequency} label="Frequency" onChange={e => handleFilterChange('frequency', e.target.value)}>
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Quarterly">Quarterly</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Period</InputLabel>
          <Select value={filters.period} label="Period" onChange={e => handleFilterChange('period', e.target.value)}>
            <MenuItem value="Current">Current</MenuItem>
            <MenuItem value="Previous">Previous</MenuItem>
            <MenuItem value="YTD">YTD</MenuItem>
          </Select>
        </FormControl>
        <TextField 
          size="small" 
          label="MM/DD/YYYY" 
          placeholder="MM/DD/YYYY"
          value={filters.date}
          onChange={e => handleFilterChange('date', e.target.value)}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filters.status} label="Status" onChange={e => handleFilterChange('status', e.target.value)}>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Unapproved">Unapproved</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Data</InputLabel>
          <Select value={filters.data} label="Data" onChange={e => handleFilterChange('data', e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Lock</InputLabel>
          <Select value={filters.lock} label="Lock" onChange={e => handleFilterChange('lock', e.target.value)}>
            <MenuItem value="Locked">Locked</MenuItem>
            <MenuItem value="Unlocked">Unlocked</MenuItem>
            <MenuItem value="All">All</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Entity</InputLabel>
          <Select value={filters.entity} label="Entity" onChange={e => handleFilterChange('entity', e.target.value)}>
            <MenuItem value="Entity A">Entity A</MenuItem>
            <MenuItem value="Entity B">Entity B</MenuItem>
            <MenuItem value="Entity C">Entity C</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search value in any column"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          sx={{ width: 400, bgcolor: 'white' }}
        />
      </Box>

      {/* Data Grid */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredFunds}
          columns={columns}
          getRowId={(row) => row.fundId}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 15 },
            },
          }}
          pageSizeOptions={[15, 30, 50]}
          disableRowSelectionOnClick
          density="compact"
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              borderBottom: '1px solid #e0e0e0',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
            }
          }}
        />
      </Paper>
    </Box>
  );
};
