package cmd

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"core/internal/server"

	"github.com/spf13/cobra"
	"golang.org/x/sync/errgroup"
)

// runCmd represents the run command
var runCmd = &cobra.Command{
	Use:   "run",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		service := server.NewService(nil)
		s := server.New(c, service)

		eg, ctx := errgroup.WithContext(context.Background())
		eg.Go(func() error {
			return s.Start(ctx)
		})

		eg.Go(func() error {
			quit := make(chan os.Signal, 1)
			signal.Notify(quit, syscall.SIGINT, syscall.SIGHUP, syscall.SIGTERM, syscall.SIGQUIT)
			select {
			case <-ctx.Done():
				return nil
			case sig := <-quit:
				return fmt.Errorf("received signal: %v", sig.String())
			}
		})

		if err := eg.Wait(); err != nil {
			logger.Error("server error", "error", err)
		}
	},
}

func init() {
	rootCmd.AddCommand(runCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// runCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// runCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
