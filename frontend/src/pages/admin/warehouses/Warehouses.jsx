import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarehouseIcon from "@mui/icons-material/Warehouse";

import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import FilterSelect from "../../../components/common/FilterSelect";
import DataTable from "../../../components/common/DataTable";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import { useNotify } from "../../../context/NotificationContext";
import { useConfirm } from "../../../context/ConfirmContext";

import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "../../../api/warehouse.api";

const CAPACITY_FILTERS = [
  { value: "all", label: "All Capacities" },
  { value: "low", label: "Low (< 500)" },
  { value: "medium", label: "Medium (500 - 2000)" },
  { value: "high", label: "High (> 2000)" },
];

const EMPTY_FORM = { name: "", location: "", capacity: "" };

export default function Warehouses() {
  const notify = useNotify();
  const confirm = useConfirm();

  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250);
  const [capacityFilter, setCapacityFilter] = useState("all");

  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getWarehouses();
      setWarehouses(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load warehouses");
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();

    return warehouses.filter((w) => {
      const matchesSearch =
        !q || `${w.name} ${w.location} ${w.capacity}`.toLowerCase().includes(q);

      const cap = Number(w.capacity) || 0;
      const matchesCapacity =
        capacityFilter === "all" ||
        (capacityFilter === "low" && cap < 500) ||
        (capacityFilter === "medium" && cap >= 500 && cap <= 2000) ||
        (capacityFilter === "high" && cap > 2000);

      return matchesSearch && matchesCapacity;
    });
  }, [warehouses, debouncedSearch, capacityFilter]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setEditId(null);
  };

  const openAddDialog = () => {
    resetForm();
    setOpen(true);
  };

  const openEditDialog = (w) => {
    setEditId(w.id);
    setForm({ name: w.name, location: w.location, capacity: String(w.capacity ?? "") });
    setFormErrors({});
    setOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.location.trim()) errs.location = "Location is required";
    if (!form.capacity || Number(form.capacity) <= 0)
      errs.capacity = "Enter a capacity greater than 0";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = { ...form, capacity: Number(form.capacity) };

    try {
      setSaving(true);
      if (editId) {
        await updateWarehouse(editId, payload);
        notify.success("Warehouse updated successfully");
      } else {
        await createWarehouse(payload);
        notify.success("Warehouse created successfully");
      }
      setOpen(false);
      resetForm();
      load();
    } catch (err) {
      notify.fromError(err, "Failed to save warehouse");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (w) => {
    const ok = await confirm({
      title: "Delete warehouse?",
      message: `"${w.name}" will be permanently removed. This action cannot be undone.`,
      confirmText: "Delete",
      danger: true,
      onConfirm: async () => {
        await deleteWarehouse(w.id);
      },
    });
    if (!ok) return;
    notify.success("Warehouse deleted");
    load();
  };

  const columns = [
    {
      field: "name",
      label: "Name",
      render: (w) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarehouseIcon fontSize="small" color="action" />
          {w.name}
        </Box>
      ),
    },
    { field: "location", label: "Location" },
    {
      field: "capacity",
      label: "Capacity",
      render: (w) => <Chip label={w.capacity} size="small" color="primary" />,
    },
    {
      field: "actions",
      label: "Actions",
      align: "right",
      render: (w) => (
        <>
          <IconButton onClick={() => openEditDialog(w)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(w)} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Warehouse Management"
        subtitle="Manage storage locations and capacity"
        actionLabel="Add Warehouse"
        actionIcon={<AddIcon />}
        onAction={openAddDialog}
        breadcrumbs={[{ label: "Admin", to: "/admin" }, { label: "Warehouses" }]}
      />

      {/* KPI cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Card sx={{ minWidth: 180, flex: "1 1 180px" }}>
          <CardContent>
            <Typography color="text.secondary" variant="body2">Total Warehouses</Typography>
            <Typography fontWeight={800} variant="h5">{warehouses.length}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 180, flex: "1 1 180px" }}>
          <CardContent>
            <Typography color="text.secondary" variant="body2">Total Capacity</Typography>
            <Typography fontWeight={800} variant="h5">
              {warehouses.reduce((a, b) => a + (Number(b.capacity) || 0), 0)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Search + filter row */}
      <Box sx={{ display: "flex", gap: 2, mb: 2.5, flexWrap: "wrap" }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name, location, or capacity..."
        />
        <FilterSelect
          label="Capacity"
          value={capacityFilter}
          onChange={setCapacityFilter}
          options={CAPACITY_FILTERS}
        />
      </Box>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        error={error}
        onRetry={load}
        emptyText={
          search || capacityFilter !== "all"
            ? "No warehouses match your search or filter"
            : "No warehouses yet"
        }
        emptyActionLabel={!search && capacityFilter === "all" ? "Add Warehouse" : undefined}
        onEmptyAction={openAddDialog}
      />

      {/* Add/Edit dialog */}
      <Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Edit Warehouse" : "Add Warehouse"}</DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2.5, mt: 1 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={Boolean(formErrors.name)}
            helperText={formErrors.name}
            autoFocus
            disabled={saving}
            fullWidth
          />
          <TextField
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            error={Boolean(formErrors.location)}
            helperText={formErrors.location}
            disabled={saving}
            fullWidth
          />
          <TextField
            label="Capacity"
            type="number"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            error={Boolean(formErrors.capacity)}
            helperText={formErrors.capacity}
            disabled={saving}
            fullWidth
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
