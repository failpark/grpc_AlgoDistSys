package main

import (
	"context"
	"fmt"
	"time"

	pb "grpc-seminar/proto"
	"google.golang.org/grpc"
)

func main() {
	conn, _ := grpc.NewClient("localhost:50051", grpc.WithInsecure())
	defer conn.Close()
	c := pb.NewFileServiceClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	resp, err := c.ListDir(ctx, &pb.Path{Path: "."})
	if err != nil {
		fmt.Println(err)
		return
	}
	for _, n := range resp.Filenames {
		fmt.Println(n)
	}
}
