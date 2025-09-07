import { Pressable, Text, ActivityIndicator, View } from "react-native";

interface ButtonsProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  className?: string;
  textStyle?: string;
}

const Buttons: React.FC<ButtonsProps> = ({
  onPress,
  title,
  loading = false,
  className,
  textStyle,
}) => {
  return (
    <Pressable className={className} onPress={onPress} disabled={loading}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className={textStyle}>{title}</Text>
      )}
    </Pressable>
  );
};

export default Buttons;
