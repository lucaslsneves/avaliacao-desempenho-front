import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react";
import React from "react";
import { FaLock } from "react-icons/fa";

export function TagLock() {
  return (
    <Tag size={"sm"} variant="subtle" colorScheme="red">
      <TagLeftIcon boxSize="12px" as={FaLock} />
      <TagLabel>Indisponível</TagLabel>
    </Tag>
  );
}
