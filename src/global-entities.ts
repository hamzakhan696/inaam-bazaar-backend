// This file is no longer needed. Entities are now defined in their own files and imported in app.module.ts.

import { Category } from "./categories/categories.entity";
import { Lottery } from "./lotteries/lotteries.entity"; 
import { Product } from "./products/products.entity";
import { CustomColor } from "./custom-colors/custom-colors.entity";
import { User } from "./user/user.entity";
import { Inventory } from "./inventory/inventory.entity";

export const entities = [Category, Lottery, Product, CustomColor, User, Inventory];
