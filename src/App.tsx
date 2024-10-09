import { useState, FunctionComponent } from "react";
import styled from "styled-components";

interface ListItem {
  id: number;
  text: string;
  children: ListItem[];
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const ListContainer = styled.ul`
  list-style-type: none;
`;

const ListItemContainer = styled.li`
  margin: 5px 0;
  padding: 5px;
  background-color: #f0f0f0;
  border-radius: 5px;
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #ff6347;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ff4500;
  }
`;

const AddButton = styled(Button)`
  background-color: #32cd32;
  &:hover {
    background-color: #228b22;
  }
`;

export const NestedList: FunctionComponent<ListItem> = () => {
  const [list, setList] = useState<ListItem[]>([
    {
      id: 1,
      text: 'Main Parent',
      children: [],
    },
  ]);

  const updateList = (
    list: ListItem[],
    parentId: number,
    updateFunction: (parent: ListItem) => ListItem
  ): ListItem[] => {
    return list.map((item) => {
      if (item.id === parentId) {
        return updateFunction(item);
      }

      if (item.children.length > 0) {
        return {
          ...item,
          children: updateList(item.children, parentId, updateFunction),
        };
      }

      return item;
    });
  };

  const addChild = (parentId: number) => {
    setList((prevList) =>
      updateList(prevList, parentId, (parent) => {
        const newChild: ListItem = {
          id: Date.now(),
          text: `Child of ${parent.text}`,
          children: [],
        };
        return {
          ...parent,
          children: [...parent.children, newChild],
        };
      })
    );
  };

  const removeItemFromList = (items: ListItem[], id: number): ListItem[] => {
    return items
      .filter((item) => item.id !== id)
      .map((item) => ({
        ...item,
        children: removeItemFromList(item.children, id),
      }));
  };

  const removeItem = (itemId: number) => {
    setList((prevList) => removeItemFromList(prevList, itemId));
  };

  const renderList = (items: ListItem[]) => {
    return (
      <ListContainer className="list-container">
        {items.map((item) => (
          <ListItemContainer key={item.id}>
            {item.text}
            <AddButton onClick={() => addChild(item.id)}>Add Child</AddButton>
            {item.id !== 1 && (
              <Button onClick={() => removeItem(item.id)}>Delete</Button>
            )}
            {item.children.length > 0 && renderList(item.children)}
          </ListItemContainer>
        ))}
      </ListContainer>
    );
  };

  return <Container className="main-container">{renderList(list)}</Container>;
};

export default NestedList;
