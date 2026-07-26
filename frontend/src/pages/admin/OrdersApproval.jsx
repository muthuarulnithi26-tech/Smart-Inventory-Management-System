import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import api from "../../api/axios";


export default function OrdersApproval() {


  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    fetchOrders();

  }, []);





  const fetchOrders = async () => {

    try {

      setLoading(true);


      const res = await api.get(
        "/orders/pending"
      );


      setOrders(
        Array.isArray(res.data)
          ? res.data
          : []
      );


    } catch (err) {

      console.log(
        "Order fetch error:",
        err
      );


      setOrders([]);


    } finally {

      setLoading(false);

    }

  };
    // APPROVE ORDER

  const approveOrder = async (id) => {

    try {

      await api.post(
        `/orders/${id}/approve`
      );


      fetchOrders();


    } catch (err) {

      console.log(
        "Approve error:",
        err
      );

    }

  };





  // REJECT ORDER

  const rejectOrder = async (id) => {

    try {

      await api.post(
        `/orders/${id}/reject`
      );


      fetchOrders();


    } catch (err) {

      console.log(
        "Reject error:",
        err
      );

    }

  };
return (
  <Box>

    <Typography variant="h5" fontWeight={700}>
      Orders Approval
    </Typography>


    {orders.length === 0 ? (

      <Typography sx={{mt:3}}>
        No pending orders
      </Typography>

    ) : (

      <Box
        sx={{
          mt:3,
          display:"grid",
          gap:2
        }}
      >

        {orders.map((order)=>(

          <Card key={order.id}>

            <CardContent>

              <Box
                sx={{
                  display:"flex",
                  justifyContent:"space-between",
                  alignItems:"center"
                }}
              >

                <Box>

                  <Typography fontWeight={700}>
                    Order #{order.id}
                  </Typography>


                  <Typography color="text.secondary">
                    Customer: {order.customer_name}
                  </Typography>


                  <Chip
                    label={order.status}
                    sx={{mt:1}}
                  />

                </Box>



                {/* ACTION BUTTONS */}

                <Box
                  sx={{
                    display:"flex",
                    gap:1
                  }}
                >

                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() =>
                      approveOrder(order.id)
                    }
                  >
                    Approve
                  </Button>



                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() =>
                      rejectOrder(order.id)
                    }
                  >
                    Reject
                  </Button>


                </Box>


              </Box>


            </CardContent>


          </Card>

        ))}

      </Box>

    )}

  </Box>
);
}
