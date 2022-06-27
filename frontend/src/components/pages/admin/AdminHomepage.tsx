import React, { useContext } from "react";
import { Flex } from "@chakra-ui/react";

import Navbar from "../../common/Navbar";
import AdminHomepageHeader from "../../admin/AdminHomepageHeader";
import { AdminNavbarTabs, AdminPages } from "../../../constants/Tabs";
import AuthContext from "../../../contexts/AuthContext";
import { Role } from "../../../types/AuthTypes";

const AdminHomepageComponent = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);

  return (
    <Flex flexFlow="column" width="100%" height="100vh">
      <Navbar
        defaultIndex={Number(AdminPages.AdminSchedulePosting)}
        tabs={AdminNavbarTabs}
      />
      <AdminHomepageHeader
        isSuperAdmin={authenticatedUser?.role === Role.Admin}
      />
    </Flex>
  );
};

export default AdminHomepageComponent;
