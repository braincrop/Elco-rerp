import { configureStore } from '@reduxjs/toolkit'
import allDevices from '../slice/devicesSlice/DevicesSlice'
import allCategories from '../slice/categories/CategorySlice'
import allProducts from '../slice/Products/productSlice'
import allBranch from '../slice/Branch/branchSlice'
import allVendiSplashMachine from '../slice/VendingSplashMachine/VendingSplashMachine'
import allItemCategory from '../slice/ItemCategory/ItemCategorySlice'
import allRestuarantItem from '../slice/RestuarantItem/RestuarantItemSlice'
import allUser from '../slice/Authentication/AuthenticationSlice'
import AllUserManagement from '../slice/UserManegement/UserManagementSlice'
import allTranslation from "../slice/Translation/TranslationSlice";
import allCoupons from "../slice/Coupons/couponsSlice";
import AllEmailType from "../slice/EmailType/EmailTypeSlice";
import AllEmployees from "../slice/Employees/EmployeeSlice";
import allEmailReceipt from "../slice/EmailReceipt/EmailReceiptSlice";
import allRoles from "../slice/Role/RoleSlice";
import AllWebSocketCommandSlice from "../slice/WebSocketCommands/WebSocketSlice";
import AllSalelogs from "../slice/SaleLogs/SaleLogSlice";
export function makeStore() {
  return configureStore({
    reducer: {
      allDevices: allDevices,
      allCategories: allCategories,
      allProducts: allProducts,
      allBranch: allBranch,
      allItemCategory: allItemCategory,
      allVendiSplashMachine: allVendiSplashMachine,
      allRestuarantItem: allRestuarantItem,
      allUser: allUser,
      AllUserManagement: AllUserManagement,
      allTranslation:allTranslation,
      allCoupons:allCoupons,
      AllEmailType:AllEmailType,
      AllEmployees:AllEmployees,
      allEmailReceipt:allEmailReceipt,
      allRoles:allRoles,
      AllWebSocketCommandSlice:AllWebSocketCommandSlice,
      AllSalelogs:AllSalelogs
    },
  })
}

export const store = makeStore()
