import { ScrollView } from "react-native";
import { Heading } from "../components/ui/heading";
import { VStack } from "../components/ui/vstack";
import { Text } from "../components/ui/text";
import { Button, ButtonText } from "../components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "../components/ui/form-control";
import { Input, InputField } from "../components/ui/input";
import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = () => {
    console.log("Submitted");
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <VStack space="md">
        <VStack>
          <Heading size="3xl" className="text-typography-black">
            สมัครสมาชิก
          </Heading>
          <Text>กรุณากรอกข้อมูลเพื่อสร้างบัญชีใหม่</Text>
        </VStack>

        <VStack>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText className="text-typography-black">
                Email
              </FormControlLabelText>
            </FormControlLabel>
            <Input className="rounded-2xl">
              <InputField
                type="text"
                placeholder="email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </Input>
          </FormControl>
        </VStack>

        <VStack>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText className="text-typography-black">
                Password
              </FormControlLabelText>
            </FormControlLabel>
            <Input className="rounded-2xl">
              <InputField
                type="password"
                placeholder="password"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </Input>
          </FormControl>
        </VStack>

        <Button className="rounded-2xl" onPress={handleSubmit}>
          <ButtonText>สมัครสมาชิก</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
}
