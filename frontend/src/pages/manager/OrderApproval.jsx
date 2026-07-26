import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";


import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";


import {
  getPendingOrders,
  approveOrder,
  rejectOrder,
} from "../../api/orderApproval.api";



export default function OrderApproval() {


  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    loadOrders();

  }, []);




  const loadOrders = async () => {

    try {

      setLoading(true);
      const data = await getPendingOrders();

      setOrders(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (err) {

      console.log(err);

      setOrders([]);

    } finally {

      setLoading(false);

    }

  };




  const handleApprove = async (id) => {

    await approveOrder(id);

    loadOrders();

  };




  const handleReject = async (id) => {

    await rejectOrder(id);

    loadOrders();

  };



  const total = orders.length;



  if (loading) {

    return (

      <Box

        sx={{

          height: "60vh",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

        }}

      >

        <CircularProgress />

      </Box>

    );

  }
// ================= PART 2 START =================


  return (

    <Box sx={{ width: "100%" }}>


      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >


        <Box>

          <Typography
            variant="h5"
            fontWeight={800}
          >
            Order Approval
          </Typography>


          <Typography
            variant="body2"
            color="text.secondary"
          >
            Approve or reject incoming warehouse orders
          </Typography>


        </Box>



        <Chip

          icon={<PendingActionsIcon />}

          label={`${total} Pending`}

          color="warning"

          sx={{
            fontWeight: 700,
          }}

        />


      </Box>





      {/* KPI CARDS */}


      <Grid
        container
        spacing={3}
        sx={{ mb: 3 }}
      >



        {/* PENDING ORDERS */}

        <Grid
          item
          xs={12}
          md={4}
        >

          <Card
            sx={{
              borderRadius: 3,
            }}
          >

            <CardContent>

              <Typography
                color="text.secondary"
              >
                Pending Orders
              </Typography>


              <Typography
                variant="h4"
                fontWeight={800}
              >
                {total}
              </Typography>


            </CardContent>


          </Card>


        </Grid>





        {/* SYSTEM STATUS */}


        <Grid
          item
          xs={12}
          md={4}
        >

          <Card
            sx={{
              borderRadius: 3,
            }}
          >

            <CardContent>


              <Typography
                color="text.secondary"
              >
                System Status
              </Typography>


              <Chip

                label="Active"

                color="success"

                sx={{
                  mt: 1,
                }}

              />


            </CardContent>


          </Card>


        </Grid>





        {/* ACTIONS AVAILABLE */}


        <Grid
          item
          xs={12}
          md={4}
        >

          <Card

            sx={{
              borderRadius: 3,
            }}

          >

            <CardContent>


              <Typography
                color="text.secondary"
              >
                Actions Available
              </Typography>


              <Typography

                variant="h6"

                fontWeight={800}

              >

                Approve / Reject

              </Typography>


            </CardContent>


          </Card>


        </Grid>



      </Grid>
       // ================= PART 3 START =================


      {/* ORDERS TABLE */}

      <Box
        sx={{
          mt: 2,
          overflowX: "auto",
        }}
      >



        {/* TABLE HEADER */}


        <Box

          sx={{

            display: "grid",

            gridTemplateColumns:
              "1fr 1fr 1fr 1fr 2fr",

            fontWeight: 800,

            p: 2,

            bgcolor: "#f1f5f9",

            borderRadius: 2,

            minWidth: 800,

          }}

        >


          <Box>
            Order
          </Box>


          <Box>
            Customer
          </Box>


          <Box>
            Amount
          </Box>


          <Box>
            Status
          </Box>


          <Box>
            Actions
          </Box>


        </Box>







        {/* TABLE DATA */}


        {orders.map((order) => (


          <Box

            key={order.id}

            sx={{

              display: "grid",

              gridTemplateColumns:
                "1fr 1fr 1fr 1fr 2fr",

              p: 2,

              borderBottom:
                "1px solid #e2e8f0",

              alignItems: "center",

              minWidth: 800,


              "&:hover": {

                bgcolor: "#f8fafc",

              },

            }}

          >





            {/* ORDER ID */}


            <Box
              sx={{
                fontWeight: 700,
              }}
            >

              #{order.id}

            </Box>







            {/* CUSTOMER ID */}


            <Box>

              {order.customer_id}

            </Box>







            {/* ORDER AMOUNT */}


            <Box
              sx={{
                fontWeight: 700,
              }}
            >

              ₹{order.total_amount}

            </Box>







            {/* STATUS */}


            <Box>


              <Chip

                label={order.status}

                color="warning"

                size="small"

              />


            </Box>







            {/* ACTION BUTTONS */}


            <Box

              sx={{

                display: "flex",

                gap: 1,

              }}

            >



              <Button

                size="small"

                variant="contained"

                color="success"

                onClick={() =>
                  handleApprove(order.id)
                }

              >

                Approve

              </Button>






              <Button

                size="small"

                variant="contained"

                color="error"

                onClick={() =>
                  handleReject(order.id)
                }

              >

                Reject

              </Button>




            </Box>





          </Box>


        ))}



      </Box>
      // ================= PART 4 START =================



      {/* EMPTY STATE */}

      {!orders.length && (

        <Box

          sx={{

            textAlign: "center",

            mt: 6,

          }}

        >

          <Typography

            color="text.secondary"

          >

            No pending orders

          </Typography>


        </Box>

      )}





    </Box>

  );

}