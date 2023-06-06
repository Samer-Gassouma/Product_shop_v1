import React from "react";
import Layout from "@/components/Layout";
import GroupCard from "@/components/GroupCard";
import { group_products } from "@/models/Group_Prod";
import { mongooseConnect } from "@/lib/mongoose";

const GroupsPage = ({Gp_Prod}) => {
  return (
    <Layout>
      <div className="container mx-auto p-4 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Gp_Prod.map((group) => (
            <GroupCard key={group._id} group={group} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default GroupsPage;



export async function getServerSideProps() {
    await mongooseConnect();
    const Gp_Prod = await group_products.find({}, null, {sort: {'_id':-1}} );
  
    return {
      props: {
        Gp_Prod: JSON.parse(JSON.stringify(Gp_Prod)),
      },
    };
  }