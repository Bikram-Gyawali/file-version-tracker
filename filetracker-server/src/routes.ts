import { Router } from "express";
import { Auth } from "./routes/api/auth.routes";
import { User } from "./routes/api/user.routes";
import { File } from "./routes/api/files.routes";
import { authMiddleware } from "./middlewares/auth";
import { Folder } from "./routes/api/folder.routes";

const router: Router = Router();

router.use("/auth", Auth);
router.use("/user", authMiddleware, User);
router.use("/file", File);
router.use("/folder", Folder);

router.get("/", (req, res) => {
  return res.send(
    ` \n ============================ \n FILE VERSION TRACKER API \n ============================ `
  );
});

export const apiRoutes: Router = router;
