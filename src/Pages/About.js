import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Dialog, DialogTitle, DialogContent, DialogActions, Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './About.css'; // Import the CSS file

let handleDeleteRow = '';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'category', headerName: 'Category', width: 130 },
  { field: 'value', headerName: 'Value', width: 130 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 100,
    sortable: false,
    renderCell: (params) => (
      <IconButton
        color="error"
        size="small"
        onClick={() => handleDeleteRow(params.id)} // Directly call handleDeleteRow with params.id
      >
        <DeleteIcon />
      </IconButton>
    ),
  },
];

export default function About() {
  const [rows, setRows] = React.useState([]);
  const [category, setCategory] = React.useState('');
  const [value, setValue] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const [isAsset, setIsAsset] = React.useState(true); // Flag to determine if it's an Asset or Expense
  const [totalValue, setTotalValue] = React.useState(0); // Track the sum of values

  const handleAssetClick = () => {
    setIsAsset(true); // Set the flag to true for Asset
    setOpenModal(true);
  };

  const handleExpenseClick = () => {
    setIsAsset(false); // Set the flag to false for Expense
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCategory('');
    setValue('');
  };

  const handleSaveItem = () => {
    if (category && value) {
      const newValue = parseFloat(value);
      const newRow = {
        id: rows.length + 1,
        category,
        value: newValue,
        type: isAsset ? 'asset' : 'expense', // Add type to distinguish Asset or Expense
        onDelete: handleDeleteRow, // Attach delete function to row
      };

      setRows([...rows, newRow]);

      // Update the total value based on Asset or Expense
      if (isAsset) {
        setTotalValue(totalValue + newValue); // Add value for Asset
      } else {
        setTotalValue(totalValue - newValue); // Subtract value for Expense
      }

      handleCloseModal();
    }
  };

  handleDeleteRow = (id) => {
    const rowToDelete = rows.find((row) => row.id === id);
    const updatedRows = rows.filter((row) => row.id !== id); // Remove the row
    setRows(updatedRows); // Set the updated rows

    // Correctly subtract the value of the deleted row from the total
    const rowValue = rowToDelete.value;
    if (rowToDelete.type === 'asset') {
      setTotalValue(totalValue - rowValue); // Subtract value for Asset
    } else {
      setTotalValue(totalValue + rowValue); // Add value back for Expense (because Expense is negative)
    }

    // Reassign IDs to the remaining rows to make them sequential
    const reindexedRows = updatedRows.map((row, index) => ({
      ...row,
      id: index + 1, // Assign new IDs starting from 1
    }));
    setRows(reindexedRows); // Update the rows with new IDs

    // If all rows are deleted, reset the total value to 0
    if (updatedRows.length === 0) {
      setTotalValue(0);
    }
  };

  // Function to add conditional class for row styling
  const getRowClassName = (params) => {
    if (params.row.type === 'asset') {
      return 'asset-row'; // Class for Asset rows
    } else if (params.row.type === 'expense') {
      return 'expense-row'; // Class for Expense rows
    }
    return '';
  };

  return (
    <div className="container" style={{ marginTop: '60px' }}> {/* Adjusted marginTop to 60px to move content up */}
      {/* Asset and Expense Buttons */}
      <div className="button-container">
        <Button variant="contained" onClick={handleAssetClick} sx={{ mb: 2 }}>
          Add Asset
        </Button>
        <Button variant="contained" onClick={handleExpenseClick} sx={{ mb: 2, ml: 2 }}>
          Add Expense
        </Button>
      </div>

      {/* Asset / Expense Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="xs">
        <DialogTitle sx={{ textAlign: 'center' }}>{isAsset ? 'Add New Asset' : 'Add New Expense'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
            />
            <TextField
              label="Value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={handleCloseModal} color="secondary" size="small">
            Cancel
          </Button>
          <Button onClick={handleSaveItem} variant="contained" size="small">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Data Grid */}
      <Paper sx={{ height: 400, width: '100%', mt: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
          getRowId={(row) => row.id} // Ensure proper row ID assignment
          getRowClassName={getRowClassName} // Apply row styling
        />
      </Paper>

      {/* Total Value Display */}
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Typography variant="h6">
          Total Value: ${totalValue.toFixed(2)} {/* Display the sum */}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, color: totalValue === 0 ? 'black' : (totalValue >= 0 ? 'green' : 'red') }}>
          {totalValue === 0
            ? 'You are at Budget'
            : totalValue >= 0
            ? `You are $${totalValue.toFixed(2)} under Budget`
            : `You are $${Math.abs(totalValue).toFixed(2)} over Budget`}
        </Typography>
      </Box>
    </div>
  );
}
