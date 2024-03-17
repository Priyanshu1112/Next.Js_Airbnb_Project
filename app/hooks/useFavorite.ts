import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import useLoginModal from "./useLoginModal";
import { User } from "@prisma/client";
import { SafeUser } from "../types/type";

interface IUseFavorite {
  listingId: string;
  currentUser?: User | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter();

  const loginModal = useLoginModal();

  /* here we have to refresh the page in order to show listing is favorite or not
   const hasFavorited = useMemo(() => {
     const list = currentUser?.favoriteIds || [];

     return list.includes(listingId);
   }, [currentUser, listingId]); */

  // here we don't have to refresh the page in order to show listing is favorite or not because we changeing hashed favorite value manually with usestate
  const [hasFavorited, setHasFavorited] = useState(() => {
    const list = currentUser?.favoriteIds || [];
    const ans = list.includes(listingId);
    return ans;
  });

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }

      try {
        let request;

        if (hasFavorited) {
          request = () => axios.delete(`/api/favorites/${listingId}`);
        } else {
          request = () => axios.post(`/api/favorites/${listingId}`);
        }

        await request();
        // here we have to refresh the page in order to show listing is favorite or not
        // router.refresh();

        // here we don't have to refresh the page in order to show listing is favorite or not because we changeing hashed favorite value manually with usestate
        setHasFavorited((prevHasFavorited) => !prevHasFavorited);
        toast.success("Success");
      } catch (error) {
        toast.error("Something went wrong.");
      }
    },
    [currentUser, hasFavorited, listingId, loginModal, router]
  );

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite;
