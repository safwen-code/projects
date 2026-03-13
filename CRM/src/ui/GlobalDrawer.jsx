import React from 'react'
import {
  Box,
  Drawer,
  Fab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import PeopleIcon from '@mui/icons-material/People'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'

import { useNavigate } from 'react-router-dom'

const GlobalDrawer = () => {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  const toggleDrawer = (state) => () => {
    setOpen(state)
  }

  const menuItems = [
    {
      text: 'Produits',
      icon: <Inventory2Icon />,
      path: '/products',
    },
    {
      text: 'Clients',
      icon: <PeopleIcon />,
      path: '/clients',
    },
    {
      text: 'Factures',
      icon: <ReceiptLongIcon />,
      path: '/invoices',
    },
  ]

  const DrawerList = (
    <Box
      sx={{
        width: 260,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <Box
        sx={{
          p: 2,
          fontWeight: 'bold',
          fontSize: 20,
          color: '#1976d2',
        }}
      >
        Menu
      </Box>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon sx={{ color: '#1976d2' }}>{item.icon}</ListItemIcon>

              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      {/* Floating Button */}
      <Fab
        onClick={toggleDrawer(true)}
        sx={{
          position: 'fixed',
          bottom: 25,
          right: 25,
          backgroundColor: '#1976d2',
          color: 'white',
          '&:hover': {
            backgroundColor: '#125ea8',
          },
        }}
      >
        <MenuIcon />
      </Fab>

      {/* Drawer */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  )
}

export default GlobalDrawer
