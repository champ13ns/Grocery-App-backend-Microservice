//
import { Request, Response, NextFunction } from "express";
import express from "express";
import { VendorService } from "../service/vendor-service";
import { authMiddleware } from "./middleware/index";
import { queryInput } from "../utils";
import { validRequest } from "./middleware/authMiddleware";
import { RPC_Observer } from "../utils/rabbitMQ";
import { VendorLoginInput, VendorSignUpInput, ProductInputs, ProductInput } from "../utils/index";
import { ValidationError } from "../utils/appError";

const router = express.Router();

const vendorService = new VendorService();

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validLoginInputs = VendorLoginInput.safeParse(req.body);
    if(validLoginInputs?.error) {
        throw new ValidationError("Wrong Login Inputs")
    }
     res.json(await vendorService.signIn(req.body.email , req.body.password))
  } 
  catch (error) {
    next(error);
  }
});

router.post("/signup", async (req: Request, res: Response, next:  NextFunction) => {
  try {
    const signUpInputs = VendorSignUpInput.safeParse(req.body);
    if(signUpInputs?.error) throw new ValidationError("Wrong signup inputs")
    res.json(await vendorService.signUp(req.body));
  } catch (error) {
    next(error);
  }
});

router.post("/product", authMiddleware, async (req: Request, res: Response, next:  NextFunction) => {
  try {
    const validProductInput = ProductInput.safeParse(req.body);
        if(validProductInput.success === false){
            throw new ValidationError("wrong inputs")   
        }
    res.json(await vendorService.addProduct(req.body));
  } catch (error) {
    next(error);
  }
});

router.get("/product", authMiddleware, async (req: Request, res: Response, next:  NextFunction) => {
  try {
    let page =
      req.query?.page === undefined
        ? 1
        : typeof req.query.page === "string"
        ? parseInt(req.query.page)
        : req.query.page;
    let limit =
      req.query?.limit === undefined
        ? 10
        : typeof req.query.limit === "string"
        ? parseInt(req.query.limit)
        : req.query.limit;
    let sort =
      req.query?.sort === undefined
        ? false
        : req.query.sort === "true"
        ? true
        : false;
    const inputRes = queryInput.safeParse({ page, limit, sort });
    if (inputRes.success === false) return res.json(inputRes.error);
    res.json(
      await vendorService.product(
        inputRes.data?.page || 1,
        inputRes.data?.limit || 10,
        inputRes.data?.sort || false
      )
    );
  } catch (error) {
    next(error);
  }
});

router.post("/bulkadd", authMiddleware, async (req: Request, res: Response,next: NextFunction) => {
  try {
    let newProductInfo: any[] = [];
    let prodInfo = req.body;
    prodInfo.map((prod: any) => {
      // @ts-ignore
      newProductInfo.push({ ...prod, vendorId: req.vendorId });
    });
    res.json(await vendorService.bulkAdd(newProductInfo));
  } catch (error) {
    next(error)
  }
});

router.get("/order",authMiddleware, async (req: validRequest, res: Response,next: NextFunction) => {
    
    try {
      const page : number = typeof req.query?.page === "string" ? parseInt(req.query?.page) : 1;
      const limit : number = typeof req.query?.limit === "string" ? parseInt(req.query?.limit) : 10;
      if(limit > 100) throw new ValidationError("Max limit can be 100")
        res.json( await vendorService.pendingOrders(req.vendorId || "", page , limit));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
